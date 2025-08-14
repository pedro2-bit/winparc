
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { FormsModule } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { RoleService } from '../../services/role.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { RoleInterface } from './Role.interface';
import { finalize } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectAuthorities } from '../../../../store/user.selectors';




@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PaginatorComponent,
    NotificationComponent,
    FormsModule
  ],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  providers: [RoleService]
})
export class RolesComponent implements OnInit {
  showRoleDrawer = false;
  selectedRole: RoleInterface | null = null;
  isLoadingDrawer = false;

  // Pour la recherche et le regroupement des privilèges dans le drawer
  privilegeSearch = '';
  filteredModules: Array<{ name: string; privileges: any[] }> = [];
  // Notification state
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'success';
  notificationShow = false;
  roles: RoleInterface[] = [];
  isLoading = true;
  error: string | null = null;
  activeContextMenu: number | null = null;


  // Pagination
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [ 10, 15, 25, 50];

  // Modal state and new role
  isDialogOpen = false;
  newRole = { code: '', libelle: '' };
  dialogError: string | null = null;
  isDialogLoading = false;
  canAddRole = false;

  constructor(
    private roleService: RoleService,
    private notificationService: NotificationService,
    private router: Router,
    private store:Store
    
  ) {
     this.store.select(selectAuthorities).subscribe((authorities: string[]) => {
      this.canAddRole = authorities?.includes('add_role');
    });
  }



  ngOnInit(): void {
    this.fetchRoles();
  }

  filterPrivileges(): void {
    const search = this.privilegeSearch.trim().toLowerCase();
    const privileges = this.selectedRole && this.selectedRole.privileges ? this.selectedRole.privileges : [];
    // Regroupement par module (extraction du préfixe avant le premier '_')
    const modulesMap: { [key: string]: any[] } = {};
    privileges.forEach((priv: any) => {
      const moduleName = priv.code && priv.code.includes('_') ? priv.code.split('_')[0] : 'Autres';
      if (!modulesMap[moduleName]) modulesMap[moduleName] = [];
      modulesMap[moduleName].push(priv);
    });
    // Filtrage
    this.filteredModules = Object.entries(modulesMap).map(([name, privs]) => ({
      name,
      privileges: search
        ? privs.filter((p: any) =>
            p.code.toLowerCase().includes(search) ||
            p.libelle.toLowerCase().includes(search) ||
            (p.description && p.description.toLowerCase().includes(search))
          )
        : privs
    })).filter(m => m.privileges.length > 0 || !search);
  }

    onAddRole() {
    this.router.navigate(['/app/settings/user-roles/create']);
  }

  onDetails(role: RoleInterface): void {
    this.isLoadingDrawer = true;
    this.showRoleDrawer = true;
    this.selectedRole = null;
    this.roleService.getRoleById(role.id).subscribe({
      next: (res: any) => {
        this.selectedRole = res.data;
        this.filterPrivileges();
        this.isLoadingDrawer = false;
      },
      error: () => {
        this.isLoadingDrawer = false;
      }
    });
  }

  closeRoleDrawer(): void {
    this.showRoleDrawer = false;
    this.selectedRole = null;
  }
    
    onSupprimerRole(role: RoleInterface): void {
      console.log('à définir');
    }
    toggleContextMenu(role: RoleInterface, event?: MouseEvent): void {
        if (event) {
          event.stopPropagation();
          event.preventDefault();
        }
        if (this.activeContextMenu === role.id) {
          this.activeContextMenu = null;
        } else {
          this.activeContextMenu = role.id;
        }
      }

  fetchRoles(): void {
    this.isLoading = true;
        // page côté API commence à 0, currentPage côté UI commence à 1
        const pageIndex = Math.max(0, this.currentPage - 1);
        const pageSize = this.pageSize;
        this.roleService.getRoles(pageIndex, pageSize)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: (response) => {
              this.roles = response.data || [];
              this.totalItems = response.totalItems ?? this.roles.length;
              // recalcul du nombre total de pages côté client si besoin
             // this.totalPages = (response.totalPages ?? Math.ceil(this.totalItems / pageSize)) || 1;
              // Correction de currentPage si l'API ne le renvoie pas ou si incohérent
              //this.currentPage = (response.currentPage && response.currentPage > 0) ? response.currentPage : (pageIndex + 1);
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
              this.roles = [];
              this.totalItems = 0;
              this.totalPages = 1;
            }
          });
  }
   changePage(page: number): void {
    this.currentPage = page;
    this.fetchRoles();
  }
  onPageChanged(page: number): void {
    this.currentPage = page;
    this.fetchRoles();
  }

    changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.fetchRoles();
  }


  showCreateDialog() {
    this.isDialogOpen = true;
    this.newRole = { code: '', libelle: '' };
    this.dialogError = null;
    this.isDialogLoading = false;
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.dialogError = null;
    this.isDialogLoading = false;
  }

  createRole(code?: string, libelle?: string) {
    const roleCode = code !== undefined ? code : this.newRole.code;
    const roleLibelle = libelle !== undefined ? libelle : this.newRole.libelle;
    // Advanced validation
    if (!roleCode.trim() || !roleLibelle.trim()) {
      this.dialogError = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    if (roleCode.length < 3 || roleCode.length > 20) {
      this.dialogError = 'Le code doit comporter entre 3 et 20 caractères.';
      return;
    }
    if (!/^[A-Z0-9_\-]+$/.test(roleCode)) {
      this.dialogError = 'Le code ne doit contenir que des lettres majuscules, chiffres, tirets ou underscores.';
      return;
    }
    if (roleLibelle.length < 3 || roleLibelle.length > 50) {
      this.dialogError = 'Le libellé doit comporter entre 3 et 50 caractères.';
      return;
    }
    this.dialogError = null;
    this.isDialogLoading = true;
    this.roleService.createRole({ code: roleCode.trim(), libelle: roleLibelle.trim() }).subscribe({
      next: (createdRole) => {
        this.isDialogLoading = false;
        this.notificationType = 'success';
        this.notificationMessage = 'Rôle créé avec succès';
        this.notificationShow = true;
        this.closeDialog();
        this.fetchRoles();
      },
      error: (err) => {
        this.isDialogLoading = false;
        this.notificationType = 'error';
        this.notificationMessage = err?.error?.message || 'Erreur lors de la création du rôle.';
        this.notificationShow = true;
      }
    });
  }

  onNotificationClosed() {
    this.notificationShow = false;
  }
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (!target.closest('.context-menu') && !target.closest('.context-menu-trigger')) {
        this.activeContextMenu = null;
      }
    }
}
