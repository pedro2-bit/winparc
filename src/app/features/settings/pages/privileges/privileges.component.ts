import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { PrivilegeService, PrivilegeInterface } from '../../services/privilege.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-privileges',
  standalone: true,
  imports: [CommonModule, PaginatorComponent],
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss'],
  providers: [PrivilegeService]
})
export class PrivilegesComponent implements OnInit {
  Math = Math;
  privileges: PrivilegeInterface[] = [];
  isLoading = true;
  error: string | null = null;

  // Pagination
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [ 10, 15, 25, 50];

  // Modal state and new privilege
  isDialogOpen = false;
  newPrivilege = { code: '', libelle: '' };
  dialogError: string | null = null;
  isDialogLoading = false;

  constructor(
    private privilegeService: PrivilegeService,
    private notificationService: NotificationService
  ) {}

   

  ngOnInit(): void {
    this.fetchPrivileges();
  }

  fetchPrivileges(): void {
    this.isLoading = true;
    // page côté API commence à 0, currentPage côté UI commence à 1
    const pageIndex = Math.max(0, this.currentPage - 1);
    const pageSize = this.pageSize;
    this.privilegeService.getPrivileges(pageIndex, pageSize)
      .subscribe({
        next: (response) => {
          this.privileges = response.data || [];
                this.totalItems = response.totalItems ?? this.privileges.length;

          // recalcul du nombre total de pages côté client si besoin
          //this.totalPages = (response.totalPages ?? Math.ceil(this.totalItems / pageSize)) || 1;
          // Correction de currentPage si l'API ne le renvoie pas ou si incohérent
          //this.currentPage = (response.currentPage && response.currentPage > 0) ? response.currentPage : (pageIndex + 1);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.error = 'Erreur lors du chargement des privilèges.';
          this.privileges = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
      });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchPrivileges();
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.fetchPrivileges();
  }

  showCreateDialog() {
    this.isDialogOpen = true;
    this.newPrivilege = { code: '', libelle: '' };
    this.dialogError = null;
    this.isDialogLoading = false;
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.dialogError = null;
    this.isDialogLoading = false;
  }

  createPrivilege(code?: string, libelle?: string) {
    const privilegeCode = code !== undefined ? code : this.newPrivilege.code;
    const privilegeLibelle = libelle !== undefined ? libelle : this.newPrivilege.libelle;
    // Advanced validation
    if (!privilegeCode.trim() || !privilegeLibelle.trim()) {
      this.dialogError = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    if (privilegeCode.length < 3 || privilegeCode.length > 20) {
      this.dialogError = 'Le code doit comporter entre 3 et 20 caractères.';
      return;
    }
    if (!/^[A-Z0-9_\-]+$/.test(privilegeCode)) {
      this.dialogError = 'Le code ne doit contenir que des lettres majuscules, chiffres, tirets ou underscores.';
      return;
    }
    if (privilegeLibelle.length < 3 || privilegeLibelle.length > 50) {
      this.dialogError = 'Le libellé doit comporter entre 3 et 50 caractères.';
      return;
    }
    this.dialogError = null;
    this.isDialogLoading = true;
    this.privilegeService.createPrivilege({ code: privilegeCode.trim(), libelle: privilegeLibelle.trim() }).subscribe({
      next: (createdPrivilege) => {
        this.isDialogLoading = false;
        this.closeDialog();
        this.notificationService.showSuccess('Privilège créé avec succès');
        this.fetchPrivileges();
      },
      error: (err) => {
        this.isDialogLoading = false;
        this.dialogError = 'Erreur lors de la création du privilège.';
      }
    });
  }
}
