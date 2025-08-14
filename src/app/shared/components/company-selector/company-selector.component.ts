import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Company } from '../../../core/services/company.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { selectUser } from '../../../store/user.selectors';
import { SiteService, Site, SitesResponse } from '../../../core/services/site.service'; 
import { setSelectedSociete, setAuthorities } from '../../../store/user.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { UserService } from '@features/auth/services/user.service';

@Component({
  selector: 'app-company-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full company-selector">
      
      <!-- Bouton de déclenchement -->
      <button 
        [disabled]="isCollapsed"
        (click)="togglePopover($event)"
        class="w-full p-2 border rounded-lg bg-white hover:bg-gray-50 focus:outline-none  text-sm flex items-center justify-between"
      >
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <span class="text-xs font-bold">{{ selectedCompany?.codeSociete || '?' }}</span>
          </div>
          <div *ngIf="!isCollapsed" class="text-left">
            <div class="font-medium">{{ selectedCompany?.raisonSociale || 'Sélectionner une société' }}</div>
            <div class="text-xs text-gray-600" *ngIf="selectedCompany">SIRET: {{ selectedCompany.siret }}</div>
          </div>
        </div>
        <svg *ngIf="!isCollapsed" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Popover -->
      <div 
        *ngIf="isPopoverOpen"
        class="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
      >
        <div class="p-2">
          <div class="relative">
            <input 
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="filterCompanies()"
              placeholder="Rechercher une société..."
              class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          
          <div class="mt-2 space-y-1">
            <button
              *ngFor="let company of filteredCompanies"
              (click)="selectCompany(company)"
              class="w-full p-2 text-left rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 flex items-center space-x-2"
            >
              <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold">{{ company.codeSociete }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{{ company.raisonSociale }}</div>
                <div class="text-xs text-gray-600 truncate">SIRET: {{ company.siret }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

     

      <!-- Boîte de dialogue des sites -->
      <!-- <div 
        *ngIf="isSitesDialogOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        (click)="closeSitesDialog()"
      >
        <div 
          class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4"
          (click)="$event.stopPropagation()"
        >
          <div class="p-4 border-b">
            <h3 class="text-lg font-medium">Sites de {{ selectedCompany?.raisonSociale }}</h3>
          </div>

          <div class="p-4">
            <div *ngIf="isLoading" class="flex justify-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>

            <div *ngIf="errorMessage" class="text-red-500 text-center py-4">
              {{ errorMessage }}
            </div>

            <div *ngIf="!isLoading && !errorMessage && (!sites || sites.length === 0)" class="text-gray-500 text-center py-4">
              Aucun site disponible pour cette société
            </div>

            <div *ngIf="!isLoading && !errorMessage && sites && sites.length > 0" class="space-y-2">
              <button
                *ngFor="let site of sites"
                (click)="selectSite(site)"
                class="w-full p-3 text-left rounded-lg hover:bg-gray-50 border border-gray-200"
              >
                <div class="font-medium">{{ site.intitule }}</div>
                <div class="text-sm text-gray-600">Code: {{ site.codeSite }}</div>
                <div class="text-sm text-gray-600">Contact: {{ site.contact }}</div>
              </button>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  `
})
export class CompanySelectorComponent implements OnInit, OnDestroy {
  @Input() selectedCompanyId: number | null = null;
  @Input() isCollapsed = false;
  @Output() companySelected = new EventEmitter<number | null>();
  @Output() siteSelected = new EventEmitter<number>();
  @Output() globalLoader = new EventEmitter<boolean>();

  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  user$: Observable<any>;
  selectedCompany: Company | null = null;
  isPopoverOpen = false;
  searchTerm = '';

  isSitesDialogOpen = false;
  sites: Site[] = [];
  isLoading = false;
  errorMessage = '';
  showGlobalLoad = false;
  API_URL = environment.apiUrl;

  constructor(
    private siteService: SiteService,
    private elementRef: ElementRef,
    private store: Store,
    private http: HttpClient,
    private userService:UserService,
    private localStorage: LocalStorageService
  ) {
    this.user$ = this.store.pipe(select(selectUser));
  }

  ngOnInit() {
    // Lecture du selectedCompanyId depuis le localStorage si non fourni en input
    if (!this.selectedCompanyId && this.localStorage.get<number>('selectedCompanyId')) {
      this.selectedCompanyId = this.localStorage.get<number>('selectedCompanyId');
    }
    this.user$.subscribe(user => {
      if (user && user.societes) {
        this.companies = user.societes;
        this.filteredCompanies = user.societes;
        if (user.societes.length > 0 && this.selectedCompanyId) {
          const company = user.societes.find((c: Company) => c.id === this.selectedCompanyId);
          if (company) {
            this.selectCompany(company);
          } else {
            this.selectCompany(user.societes[0]);
            this.localStorage.set('selectedCompanyId', user.societes[0].id);
          }
        } else if (user.societes.length > 0) {
          this.selectCompany(user.societes[0]);
          this.localStorage.set('selectedCompanyId', user.societes[0].id);
        }
      }
    });
    if (this.localStorage.get<number>('selectedSiteId')) {
      // document.addEventListener('click', this.handleClickOutside.bind(this));
    }
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isPopoverOpen = false;
    }
  }

  togglePopover(event: MouseEvent) {
    event.stopPropagation();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  // Suppression de loadCompanies : les sociétés sont chargées depuis le store utilisateur

  filterCompanies() {
    if (!this.searchTerm) {
      this.filteredCompanies = this.companies;
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredCompanies = this.companies.filter(company =>
        company.raisonSociale.toLowerCase().includes(searchLower) ||
        company.siret.includes(searchLower) ||
        company.codeSociete.toLowerCase().includes(searchLower)
      );
    }
  }

  selectCompany(company: Company) {
    this.selectedCompany = company;
    this.selectedCompanyId = company.id;
    const lastSelectedCompanyId = this.localStorage.get<number>('selectedCompanyId');
    this.localStorage.set('selectedCompanyId', company.id);
    // Ensure modules property exists for societe
    this.store.dispatch(setSelectedSociete({ societe: { ...company, modules: company.modules ?? [] } }));
    this.companySelected.emit(company.id);
    this.isPopoverOpen = false;
    this.searchTerm = '';
    this.filterCompanies();

    // Loader global ON
    this.showGlobalLoad = true;
    this.globalLoader.emit(true);
    // Récupérer l'utilisateur courant (id) depuis le store
    let utilisateurId: string | number | undefined;
    this.user$.pipe(take(1)).subscribe((user: any) => {
      if (user && user.id) {
        utilisateurId = user.id;
      }
    });
    if (utilisateurId === undefined) {
      console.error('Impossible de récupérer l\'ID utilisateur pour charger les authorizations.');
      this.showGlobalLoad = false;
      return;
    }
    const societeId = company.id;
    this.userService.getUserAuthorizations(societeId, utilisateurId.toString()).subscribe({
      next: (userDetails:any) => {
        // Extraire tous les codes de privilèges de tous les rôles
        const authorities: string[] = [];
        if (userDetails && userDetails.data.roles) {
          userDetails.data.roles.forEach((role: any) => {
            if (role.privileges) {
              role.privileges.forEach((priv: any) => {
                if (priv.code && !authorities.includes(priv.code)) {
                  authorities.push(priv.code);
                }
              });
            }
          });
        }
        
        // Stocker dans le store (action typée)
        this.store.dispatch(setAuthorities({ authorities }));
        // Stocker dans les cookies
        document.cookie = `authorities=${encodeURIComponent(JSON.stringify(authorities))}; path=/;`;
      },
      error: (err) => {
        // Optionnel : gestion d'erreur
        console.error('Erreur lors de la récupération des privilèges:', err);
      },
      complete: () => {
        setTimeout(()=>{
          this.showGlobalLoad = false;
          this.globalLoader.emit(false);
        }, 3000)
        
      }
    });

    if (lastSelectedCompanyId !== this.localStorage.get<number>('selectedCompanyId')) {
      this.loadSites(company.id);
    }
  }

  loadSites(societeId: number) {
    this.isSitesDialogOpen = true;
    this.isLoading = true;
    this.errorMessage = '';
    this.sites = [];

    this.siteService.getSitesBySocieteId(societeId).subscribe({
      next: (response: SitesResponse<Site[]>) => {
        this.sites = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des sites';
        this.isLoading = false;
        console.error('Erreur lors du chargement des sites:', error);
      }
    });
  }

  closeSitesDialog() {
    this.isSitesDialogOpen = false;
    this.sites = [];
    this.errorMessage = '';
  }

  selectSite(site: Site) {
    this.localStorage.set('selectedSiteId', site.id);
    
    this.siteService.getSiteById(site.id).subscribe({
      next: (siteDetails) => {
        console.log('Site sélectionné:', siteDetails);
        this.siteSelected.emit(site.id);
        this.closeSitesDialog();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des détails du site:', error);
      }
    });
  }
}