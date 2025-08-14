import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { RoleService } from '../../services/role.service';
import { PrivilegeInterface } from './Role.interface';

import { PrivilegeService } from '@features/settings/services/privilege.service';

@Component({
  selector: 'app-role-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NotificationComponent],
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss'],
  providers: [RoleService]
})
export class RoleCreateComponent implements OnInit {
  roleForm: FormGroup;
  privilegesList: PrivilegeInterface[] = [];
  filteredPrivileges: PrivilegeInterface[] = [];
  selectedPrivileges: number[] = [];
  isLoading = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'success';
  notificationShow = false;
  search = '';
  globallLoading=true;
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private privilegeService: PrivilegeService,
    public router: Router
  ) {
    this.roleForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[A-Z0-9_\-]+$')]],
      libelle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      privileges: [[]]
    });
  }

  ngOnInit(): void {
    this.loadPrivileges();
  }
  loadPrivileges() {
    this.globallLoading=true;
    // Appel au service pour charger les modules
    this.privilegeService.getAllPrivileges().subscribe({

        next: (response:any) => {
         console.log((response));
        this.privilegesList = response.data || response;
        this.filteredPrivileges = this.privilegesList;
        this.globallLoading=false;
      },
      error: (err) => {
        this.globallLoading=false;
        this.notificationType = 'error';
        this.notificationMessage = err?.error?.message || 'Erreur lors du chargemen des privilèges.';
        this.notificationShow = true;
      }
       

    });
    }
  // fetchPrivileges() method removed; now using loadPrivileges() for real data

  onSearchChange() {
    const searchLower = this.search.toLowerCase();
    this.filteredPrivileges = this.privilegesList.filter(p =>
      p.code.toLowerCase().includes(searchLower) ||
      p.libelle.toLowerCase().includes(searchLower) ||
      (p['description'] && p['description'].toLowerCase().includes(searchLower))
    );
  }

  onPrivilegeToggle(privilege: PrivilegeInterface, checked: boolean) {
    if (checked) {
      if (!this.selectedPrivileges.includes(privilege.id)) {
        this.selectedPrivileges.push(privilege.id);
      }
    } else {
      this.selectedPrivileges = this.selectedPrivileges.filter(id => id !== privilege.id);
    }
    this.roleForm.patchValue({ privileges: this.selectedPrivileges });
  }

  createRole() {
    if (this.roleForm.invalid) return;
    this.isLoading = true;
    const { code, libelle } = this.roleForm.value;
    const privilegeIds = this.selectedPrivileges;
    this.roleService.createRole({ code, libelle, privilegeIds }).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationType = 'success';
        this.notificationMessage = 'Rôle créé avec succès';
        this.notificationShow = true;
        setTimeout(() => this.router.navigate(['/app/settings/user-roles']), 1200);
      },
      error: (err) => {
        this.isLoading = false;
        this.notificationType = 'error';
        this.notificationMessage = err?.error?.message || 'Erreur lors de la création du rôle.';
        this.notificationShow = true;
      }
    });
  }

  onNotificationClosed() {
    this.notificationShow = false;
  }
  // Returns true if the privilege is selected
  isPrivilegeSelected(privilege: PrivilegeInterface): boolean {
    return this.selectedPrivileges.includes(privilege.id);
  }

  areAllPrivilegesSelected(): boolean {
    return this.filteredPrivileges.length > 0 && this.filteredPrivileges.every(p => this.selectedPrivileges.includes(p.id));
  }

  onToggleAllPrivileges(checked: boolean): void {
    if (checked) {
      // Add all filtered privilege IDs
      const idsToAdd = this.filteredPrivileges.map(p => p.id);
      this.selectedPrivileges = Array.from(new Set([...this.selectedPrivileges, ...idsToAdd]));
    } else {
      // Remove all filtered privilege IDs
      const idsToRemove = this.filteredPrivileges.map(p => p.id);
      this.selectedPrivileges = this.selectedPrivileges.filter(id => !idsToRemove.includes(id));
    }
    this.roleForm.patchValue({ privileges: this.selectedPrivileges });
  }
  
}
