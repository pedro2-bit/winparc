import { Component, OnInit, HostListener } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUser, selectAuthorities } from '../../store/user.selectors';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForetService } from './forets.service';
import { ForetInterface, ForetInterfaceCreation, ForetResponseInterface } from './foret.interface'
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { LocalStorageService } from '@core/services/local-storage.service';
import { BehaviorSubject, of } from 'rxjs';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { NotificationService } from '../../core/services/notification.service';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { foretFormComponent } from './foret-form/foret-form.component';

@Component({
  selector: 'app-Forets',
  templateUrl: './forets.component.html',
  styleUrls: ['./forets.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NotificationComponent, PaginatorComponent,foretFormComponent ]
})
export class ForetsComponent implements OnInit {
  forets: ForetInterface[] = [];
  isLoading = false;
  searchTerm = '';
  societyName: string = '';
  user$: Observable<any>;
  selectedForet: ForetInterface | null = null;
  contextMenuForet: ForetInterface | null = null;
  showDetailsModal = false;
  showAddOrEditCommandeModal = false;
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [ 10, 15, 25, 50];
  Math = Math; // Pour utiliser Math dans le template
  commandeForm!: FormGroup;
  Forets$ = new BehaviorSubject<any[]>([]);
  representants$ = new BehaviorSubject<any[]>([]);
  devises$ = new BehaviorSubject<any[]>([]);
  conditionsPaiement$ = new BehaviorSubject<any[]>([]);
  isLoadingForets = false;
  isLoadingSites = false;
  isLoadingRepresentants = false;
  isLoadingDevises = false;
  isLoadingConditions = false;
  searchForetText = '';
  showForetDropdown = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  step = 1;
  lignesCommandeForm!: FormArray;
  forets$ = new BehaviorSubject<any[]>([]);
  conditions$ = new BehaviorSubject<any[]>([]);
  unites$ = new BehaviorSubject<any[]>([]);
  tarifs$ = new BehaviorSubject<any[]>([]);
  isLoadingforets = false;
  isLoadingTarifs = false;
  createdCommandeId: number | null = null;
  isLoadingUnites = false;
  lignesCommandeFormGroup!: FormGroup;
  isLoadingConditionnements = false;
  // Gestion de la sélection
  selectedForets = new Set<number>();
  isAllSelected = false;
    // Gestion du menu contextuel
  activeContextMenu: number | null = null;
    // État de la boîte de dialogue
  isEditMode = false;
  isDuplicateMode = false;

  isDetailsDrawerOpen = false;
  selectedForetId: number | null = null;
  notification = { show: false, message: '', type: 'success' as 'success' | 'error' | 'info' };
  filteredForets: ForetInterface[] = [];

  // Pour la confirmation d'activation/désactivation
 showAddOrEditForetModal = false;
  canAddForet = false;
  constructor(private localStorage: LocalStorageService, private foretService: ForetService, private router: Router, 
    private store: Store, private notificationService: NotificationService) {
    this.user$ = this.store.pipe(select(selectUser));
     this.store.select(selectAuthorities).subscribe((authorities: string[]) => {
      this.canAddForet = authorities?.includes('add_foret');
    });
  }

  ngOnInit(): void {
    // Récupère la raison sociale de la société sélectionnée depuis le store
    this.user$.subscribe(user => {
      if (user && user.societes && user.societes.length > 0) {
        const selectedCompanyId = this.localStorage.get<number>('selectedCompanyId');
        const selectedCompany = user.societes.find((c: any) => c.id.toString() === selectedCompanyId);
        this.societyName = selectedCompany ? selectedCompany.raisonSociale : '';
      } else {
        this.societyName = '';
      }
    });

    // Souscrit aux notifications globales (serveur indisponible, etc.)
    this.notificationService.notification$.subscribe(n => {
      this.notification = { show: true, message: n.message, type: n.type };
      // Pour les alertes info (serveur indisponible), la notification ne disparaît que sur clic croix
      if (n.type !== 'info') {
        setTimeout(() => this.notification.show = false, 5000);
      }
    });
    this.loadForets();

    const notif = sessionStorage.getItem('ForetNotification');
    if (notif) {
      const { message, type } = JSON.parse(notif);
      this.notification = { show: true, message, type };
      sessionStorage.removeItem('ForetNotification');
      setTimeout(() => this.notification.show = false, 7500);
    }

    // Écoute l'événement personnalisé "Foret-notification" pour afficher la notification
    window.addEventListener('Foret-notification', (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string; type: 'success' | 'error' | 'info' }>;
      if (customEvent.detail) {
        this.notification = {
          show: true,
          message: customEvent.detail.message,
          type: customEvent.detail.type
        };
        if (customEvent.detail.type !== 'info') {
          setTimeout(() => this.notification.show = false, 5000);
        }
      }
    });
  }

   saveForet(foret: Partial<ForetInterfaceCreation>): void {
    if (this.selectedForet?.id) {

    } else {
      // Création
      this.foretService.createForet(foret).subscribe({
       
      });
    }
  }


  loadForets(): void {
    this.isLoading = true;
    // page côté API commence à 0, currentPage côté UI commence à 1
    const pageIndex = Math.max(0, this.currentPage - 1);
    const pageSize = this.pageSize;
    this.foretService.getForetsBySociete(pageIndex, pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.forets = response.data || [];
          this.totalItems = response.totalItems ?? this.forets.length;
          // recalcul du nombre total de pages côté Foret si besoin
          this.totalPages = (response.totalPages ?? Math.ceil(this.totalItems / pageSize)) || 1;
          // Correction de currentPage si l'API ne le renvoie pas ou si incohérent
          this.currentPage = (response.currentPage && response.currentPage > 0) ? response.currentPage : (pageIndex + 1);
      
        },
        error: (error) => {
          console.error('Erreur lors du chargement des Forets:', error);
          // Affiche la notification si le serveur est indisponible (en complément de l'intercepteur)
          if (
            (error && error.status === 0) ||
            (error && error.status === 503) ||
            (error && error.message && error.message.toLowerCase().includes('unknown error')) ||
            (error && error.error && error.error.type === 'error')
          ) {
            this.notificationService.showInfo('Serveur indisponible');
          }
          this.forets = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
      });
  }

  toggleContextMenu(Foret: ForetInterface, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.activeContextMenu === Foret.id) {
      this.activeContextMenu = null;
    } else {
      this.activeContextMenu = Foret.id;
    }
  }

  onSelectForet(foret: ForetInterface | null): void {
    this.selectedForet = foret;
    this.contextMenuForet = null;
    //this.showDetailsModal = true;
  }
  printForet(Foret: ForetInterface): void {
    this.foretService.printForet(Foret.id).subscribe({
      next: (response) => {
        // Gérer la réponse de l'impression
      },
      error: (error) => {
        console.error('Erreur lors de l\'impression du Foret:', error);
      }
    });
  }
  duplicateForet(foret: ForetInterface): void {
    console.log('à définir');
    
    // const { id, ...newForet } = Foret;
    // this.ForetService.createForet(newForet).subscribe({
    //   next: (response) => {
    //     this.forets = [...this.forets, response.data];
    //   },
    //   error: (error) => {
    //     console.error('Erreur lors de la duplication:', error);
    //   }
    // });
  }
  showDetails(Foret: ForetInterface): void {
    this.selectedForet = Foret;
    this.showDetailsModal = true;
  }
  deleteForet(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce Foret ?')) {
      this.foretService.deleteForet(id).subscribe({
        next: () => {
          this.forets = this.forets.filter(foret => foret.id !== id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }
  isSelected(ForetId: number): boolean {
    return this.selectedForets.has(ForetId);
  }
   toggleSelectAll(): void {
    if (this.selectedForets.size === this.filteredForets.length) {
      this.selectedForets.clear();
    } else {
      this.filteredForets.forEach(Foret => this.selectedForets.add(Foret.id));
    }
    this.isAllSelected = this.filteredForets.every(Foret => 
      this.selectedForets.has(Foret.id)
    );
  }

  toggleSelect(ForetId: number): void {
    if (this.selectedForets.has(ForetId)) {
      this.selectedForets.delete(ForetId);
    } else {
      this.selectedForets.add(ForetId);
    }
    this.isAllSelected = this.filteredForets.every(Foret => 
      this.selectedForets.has(Foret.id)
    );
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    this.searchTerm = target.value;
    this.currentPage = 1;
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.loadForetsBySearch(this.searchTerm);
    } else {
      this.loadForets();
    }
  }

  loadForetsBySearch(query: string): void {
    this.isLoading = true;
    const pageIndex = Math.max(0, this.currentPage - 1);
    const pageSize = this.pageSize;
    this.foretService.getSearchForetBySociete(query, pageIndex, pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          this.forets = response.data || [];
          this.totalItems = response.totalItems ?? this.forets.length;
          this.totalPages = (response.totalPages ?? Math.ceil(this.totalItems / pageSize)) || 1;
          this.currentPage = (response.currentPage && response.currentPage > 0) ? response.currentPage : (pageIndex + 1);
        },
        error: (error: any) => {
          console.error('Erreur lors de la recherche des forets:', error);
          this.forets = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
      });
  }


 changePage(page: number): void {
    this.currentPage = page;
    this.loadForets();
  }
  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadForets();
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadForets();
  }
  shouldShowEllipsis(page: number): boolean {
    if (page === 1 || page === this.totalPages) {
      return false;
    }
    
    const range = 2;
    const prevPage = page - 1;
    const nextPage = page + 1;
    
    return (
      (prevPage > 1 && prevPage < this.currentPage - range) ||
      (nextPage < this.totalPages && nextPage > this.currentPage + range)
    );
  }
    shouldShowPageButton(page: number): boolean {
    if (page === 1 || page === this.totalPages) {
      return true;
    }
    const range = 2;
    return page >= this.currentPage - range && page <= this.currentPage + range;
  }


  onNotificationClosed() {
    this.notification.show = false;
  }
    // Fermer le menu contextuel lors d'un clic en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Ferme le menu si on clique en dehors du menu contextuel ou du bouton d'ouverture
    if (!target.closest('.context-menu') && !target.closest('.context-menu-trigger')) {
      this.activeContextMenu = null;
    }
  }
  onModifier(Foret: ForetInterface): void {
    console.log('Modifier Foret:', Foret);
    this.activeContextMenu = null;
  }

  onDetails(Foret: ForetInterface): void {
    this.selectedForetId = Foret.id;
    this.isDetailsDrawerOpen = true;
    this.activeContextMenu = null;
    
  }

  onDupliquer(Foret: ForetInterface): void {
    console.log('Dupliquer Foret:', Foret);
    this.activeContextMenu = null;
  }

  onSupprimer(Foret: ForetInterface): void {
    console.log('Supprimer Foret:', Foret);
    this.activeContextMenu = null;
    // Implémenter la logique de suppression
  }
}