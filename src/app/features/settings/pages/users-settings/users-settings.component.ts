import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UserProfile } from '../../services/user.service';

@Component({
  selector: 'app-users-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-settings.component.html',
  styleUrls: ['./users-settings.component.scss']
})
export class UsersSettingsComponent implements OnInit {
  users: UserProfile[] = [];
  error: string | null = null;
  isLoading = true;
  isDialogOpen = false;
  dialogError: string | null = null;
  newUser = {
    prenom: '',
    nom: '',
    email: '',
    login: '',
    motDePasse: '',
    profile: ''
  };
  profiles: any[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadProfiles();
  }

  loadProfiles() {
    this.usersService.getProfiles().subscribe({
      next: (profiles) => {
        this.profiles = profiles;
        console.log('Profils chargés:', profiles);
      },
      error: (err) => {
        this.dialogError = 'Erreur lors du chargement des profils';
        console.error('Erreur lors du chargement des profils:', err);
      }
    });
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
        console.log(users);
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  getInitials(user: UserProfile): string {
    return user.prenom.charAt(0).toUpperCase() + user.nom.charAt(0).toUpperCase();
  }

  showCreateDialog() {
    this.isDialogOpen = true;
    this.dialogError = null;
    this.newUser = {
      prenom: '',
      nom: '',
      email: '',
      login: '',
      motDePasse: '',
      profile: ''
    };
    
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.dialogError = null;
  }

  createUser() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.dialogError = null;

    this.usersService.createUser(this.newUser).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.closeDialog();
        // Rafraîchir la liste des utilisateurs
        this.ngOnInit();
      },
      error: (error) => {
        this.isLoading = false;
        this.dialogError = error.error?.message || 'Une erreur est survenue lors de la création de l\'utilisateur';
      }
    });
  }

  private validateForm(): boolean {
    if (!this.newUser.prenom || !this.newUser.nom || !this.newUser.email || 
        !this.newUser.login || !this.newUser.motDePasse || !this.newUser.profile) {
      this.dialogError = 'Veuillez remplir tous les champs';
      return false;
    }
    return true;
  }
} 