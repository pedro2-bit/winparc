import { Component, OnInit, HostListener } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUser, selectAuthorities } from '../../store/user.selectors';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from './clients.service';
import { ClientInterface, ClientResponseInterface } from './client.interface';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { LocalStorageService } from '@core/services/local-storage.service';
import { BehaviorSubject, of } from 'rxjs';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { NotificationService } from '../../core/services/notification.service';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { ClientConfirmationComponent } from './client-confirmation.component';
import { RemoveClientPrefixPipe } from './remove-client-prefix.pipe';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NotificationComponent, PaginatorComponent, ClientConfirmationComponent, RemoveClientPrefixPipe]
})
export class ClientsComponent implements OnInit {
  clients: ClientInterface[] = [];
  isLoading = false;
  searchTerm = '';
  societyName: string = '';
  user$: Observable<any>;
  selectedClient: ClientInterface | null = null;
  contextMenuClient: ClientInterface | null = null;
  showDetailsModal = false;
  showAddOrEditCommandeModal = false;
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [ 10, 15, 25, 50];
  Math = Math; // Pour utiliser Math dans le template
  commandeForm!: FormGroup;
  clients$ = new BehaviorSubject<any[]>([]);
  representants$ = new BehaviorSubject<any[]>([]);
  devises$ = new BehaviorSubject<any[]>([]);
  conditionsPaiement$ = new BehaviorSubject<any[]>([]);
  isLoadingClients = false;
  isLoadingSites = false;
  isLoadingRepresentants = false;
  isLoadingDevises = false;
  isLoadingConditions = false;
  searchClientText = '';
  showClientDropdown = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  step = 1;
  lignesCommandeForm!: FormArray;
  articles$ = new BehaviorSubject<any[]>([]);
  conditions$ = new BehaviorSubject<any[]>([]);
  unites$ = new BehaviorSubject<any[]>([]);
  tarifs$ = new BehaviorSubject<any[]>([]);
  isLoadingArticles = false;
  isLoadingTarifs = false;
  createdCommandeId: number | null = null;
  isLoadingUnites = false;
  lignesCommandeFormGroup!: FormGroup;
  isLoadingConditionnements = false;
  // Gestion de la sélection
  selectedClients = new Set<number>();
  isAllSelected = false;
    // Gestion du menu contextuel
  activeContextMenu: number | null = null;
    // État de la boîte de dialogue
  isEditMode = false;
  isDuplicateMode = false;

  isDetailsDrawerOpen = false;
  selectedClientId: number | null = null;
  notification = { show: false, message: '', type: 'success' as 'success' | 'error' | 'info' };
  filteredClients: ClientInterface[] = [];

  // Pour la confirmation d'activation/désactivation
  showClientConfirmation = false;
  confirmationClient: ClientInterface | null = null;
  confirmationAction: 'activer' | 'desactiver' = 'activer';
  confirmationEtatId: number | null = null;
  canAddClient = false;
  constructor(private localStorage: LocalStorageService, private clientService: ClientService, private store: Store, private router: Router, private notificationService: NotificationService) {
    this.user$ = this.store.pipe(select(selectUser));
     this.store.select(selectAuthorities).subscribe((authorities: string[]) => {
      this.canAddClient = authorities?.includes('add_client');
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
    this.loadClients();

    const notif = sessionStorage.getItem('clientNotification');
    if (notif) {
      const { message, type } = JSON.parse(notif);
      this.notification = { show: true, message, type };
      sessionStorage.removeItem('clientNotification');
      setTimeout(() => this.notification.show = false, 7500);
    }

    // Écoute l'événement personnalisé "client-notification" pour afficher la notification
    window.addEventListener('client-notification', (event: Event) => {
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

  //activation / désactivation d'un client
  changeStatutClient(client: ClientInterface, commande: Number): void {
   
    if (commande == 1) {
      this.confirmationClient = client;
      this.confirmationAction = 'activer';
      this.showClientConfirmation = true;
      this.confirmationEtatId = client.etatClientDto?.id ?? null;
    } else if (commande == 2) {
      this.confirmationClient = client;
      this.confirmationAction = 'desactiver';
      this.showClientConfirmation = true;
      this.confirmationEtatId = client.etatClientDto?.id ?? null;
    }
  }

  onClientConfirmation(result: boolean) {
    if (result) {
      this.loadClients();
    }
    this.showClientConfirmation = false;
    this.confirmationClient = null;
  }

  loadClients(): void {
    this.isLoading = true;
    // page côté API commence à 0, currentPage côté UI commence à 1
    const pageIndex = Math.max(0, this.currentPage - 1);
    const pageSize = this.pageSize;
    this.clientService.getClientsBySociete(pageIndex, pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.clients = response.data || [];
          this.totalItems = response.totalItems ?? this.clients.length;
          // recalcul du nombre total de pages côté client si besoin
          this.totalPages = (response.totalPages ?? Math.ceil(this.totalItems / pageSize)) || 1;
          // Correction de currentPage si l'API ne le renvoie pas ou si incohérent
          this.currentPage = (response.currentPage && response.currentPage > 0) ? response.currentPage : (pageIndex + 1);
          this.clients.map(cl =>{
            console.log('cl',cl.etatClientDto?.libelle);
            
          })
        },
        error: (error) => {
          console.error('Erreur lors du chargement des clients:', error);
          // Affiche la notification si le serveur est indisponible (en complément de l'intercepteur)
          if (
            (error && error.status === 0) ||
            (error && error.status === 503) ||
            (error && error.message && error.message.toLowerCase().includes('unknown error')) ||
            (error && error.error && error.error.type === 'error')
          ) {
            this.notificationService.showInfo('Serveur indisponible');
          }
          this.clients = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
      });
  }

  toggleContextMenu(client: ClientInterface, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.activeContextMenu === client.id) {
      this.activeContextMenu = null;
    } else {
      this.activeContextMenu = client.id;
    }
  }

  onSelectClient(client: ClientInterface | null): void {
    this.selectedClient = client;
    this.contextMenuClient = null;
    //this.showDetailsModal = true;
  }
  printClient(client: ClientInterface): void {
    this.clientService.printClient(client.id).subscribe({
      next: (response) => {
        // Gérer la réponse de l'impression
      },
      error: (error) => {
        console.error('Erreur lors de l\'impression du client:', error);
      }
    });
  }
  duplicateClient(client: ClientInterface): void {
    const { id, ...newClient } = client;
    this.clientService.createClient(newClient).subscribe({
      next: (response) => {
        this.clients = [...this.clients, response.data];
      },
      error: (error) => {
        console.error('Erreur lors de la duplication:', error);
      }
    });
  }
  showDetails(client: ClientInterface): void {
    this.selectedClient = client;
    this.showDetailsModal = true;
  }
  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.clients = this.clients.filter(client => client.id !== id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }
  isSelected(clientId: number): boolean {
    return this.selectedClients.has(clientId);
  }
   toggleSelectAll(): void {
    if (this.selectedClients.size === this.filteredClients.length) {
      this.selectedClients.clear();
    } else {
      this.filteredClients.forEach(client => this.selectedClients.add(client.id));
    }
    this.isAllSelected = this.filteredClients.every(client => 
      this.selectedClients.has(client.id)
    );
  }

  toggleSelect(clientId: number): void {
    if (this.selectedClients.has(clientId)) {
      this.selectedClients.delete(clientId);
    } else {
      this.selectedClients.add(clientId);
    }
    this.isAllSelected = this.filteredClients.every(client => 
      this.selectedClients.has(client.id)
    );
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    this.searchTerm = target.value;
    this.currentPage = 1;
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.loadClientsBySearch(this.searchTerm);
    } else {
      this.loadClients();
    }
  }

  loadClientsBySearch(query: string): void {
    this.isLoading = true;
    const pageIndex = Math.max(0, this.currentPage - 1);
    const pageSize = this.pageSize;
    this.clientService.getSearchClientBySociete(query, pageIndex, pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          this.clients = response.data || [];
          this.totalItems = response.totalItems ?? this.clients.length;
          this.totalPages = (response.totalPages ?? Math.ceil(this.totalItems / pageSize)) || 1;
          this.currentPage = (response.currentPage && response.currentPage > 0) ? response.currentPage : (pageIndex + 1);
        },
        error: (error: any) => {
          console.error('Erreur lors de la recherche des clients:', error);
          this.clients = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
      });
  }


 changePage(page: number): void {
    this.currentPage = page;
    this.loadClients();
  }
  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadClients();
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadClients();
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

  onAddClient(): void {
    this.router.navigate(['/app/clients/add']);
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
  onModifier(client: ClientInterface): void {
    console.log('Modifier client:', client);
    this.activeContextMenu = null;
  }

  onDetails(client: ClientInterface): void {
    this.selectedClientId = client.id;
    this.isDetailsDrawerOpen = true;
    this.activeContextMenu = null;
    
  }

  onDupliquer(client: ClientInterface): void {
    console.log('Dupliquer client:', client);
    this.activeContextMenu = null;
  }

  onSupprimer(client: ClientInterface): void {
    console.log('Supprimer client:', client);
    this.activeContextMenu = null;
    // Implémenter la logique de suppression
  }
}