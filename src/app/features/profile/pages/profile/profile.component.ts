import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      
      <!-- Main Content -->
      <div class="flex-1">
        <!-- Titlebar -->
        <header class="bg-white shadow-sm">
          <div class="flex items-center justify-between px-4 py-3">
            <h1 class="text-xl font-semibold text-gray-800">Profil</h1>
            <div class="flex items-center space-x-4">
              
            </div>
          </div>
        </header>

        <!-- Profile Content -->
        <div class="p-6">
          <div class="max-w-3xl mx-auto">
            <!-- Profile Header -->
            <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div class="flex items-center space-x-4">
                <div class="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                  JD
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">John Doe</h2>
                  <p class="text-gray-500">Membre depuis Mars 2024</p>
                </div>
              </div>
            </div>

            <!-- Profile Form -->
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <h3 class="text-lg font-medium text-gray-900 mb-6">Informations personnelles</h3>
              
              <form (ngSubmit)="onSubmit()" class="space-y-6">
                <!-- Nom complet -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nom complet</label>
                  <div class="mt-1">
                    <input type="text" [(ngModel)]="profile.fullName" name="fullName"
                           class="form-input"
                           placeholder="Votre nom complet" />
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <div class="mt-1">
                    <input type="email" [(ngModel)]="profile.email" name="email"
                           class="form-input"
                           placeholder="Votre email" />
                  </div>
                </div>

                <!-- Téléphone -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Téléphone</label>
                  <div class="mt-1">
                    <input type="tel" [(ngModel)]="profile.phone" name="phone"
                           class="form-input"
                           placeholder="Votre numéro de téléphone" />
                  </div>
                </div>

                <!-- Adresse -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Adresse</label>
                  <div class="mt-1">
                    <textarea [(ngModel)]="profile.address" name="address"
                              class="form-input"
                              rows="3"
                              placeholder="Votre adresse"></textarea>
                  </div>
                </div>

                <!-- Notifications -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-4">Préférences de notification</h4>
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <input type="checkbox" id="emailNotif"
                             [(ngModel)]="profile.notifications.email"
                             name="emailNotif"
                             class="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded" />
                      <label for="emailNotif" class="ml-2 block text-sm text-gray-700">
                        Notifications par email
                      </label>
                    </div>
                    <div class="flex items-center">
                      <input type="checkbox" id="smsNotif"
                             [(ngModel)]="profile.notifications.sms"
                             name="smsNotif"
                             class="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded" />
                      <label for="smsNotif" class="ml-2 block text-sm text-gray-700">
                        Notifications par SMS
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Boutons -->
                <div class="flex justify-end space-x-3">
                  <button type="button" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Annuler
                  </button>
                  <button type="submit" class="btn-primary">
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>

            <!-- Sécurité -->
            <div class="bg-white rounded-lg p-6 shadow-sm mt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-6">Sécurité</h3>
              
              <form (ngSubmit)="onChangePassword()" class="space-y-6">
                <!-- Ancien mot de passe -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Ancien mot de passe</label>
                  <div class="mt-1">
                    <input type="password" [(ngModel)]="passwordForm.oldPassword" name="oldPassword"
                           class="form-input"
                           placeholder="Votre ancien mot de passe" />
                  </div>
                </div>

                <!-- Nouveau mot de passe -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                  <div class="mt-1">
                    <input type="password" [(ngModel)]="passwordForm.newPassword" name="newPassword"
                           class="form-input"
                           placeholder="Votre nouveau mot de passe" />
                  </div>
                </div>

                <!-- Confirmer le nouveau mot de passe -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                  <div class="mt-1">
                    <input type="password" [(ngModel)]="passwordForm.confirmPassword" name="confirmPassword"
                           class="form-input"
                           placeholder="Confirmer votre nouveau mot de passe" />
                  </div>
                </div>

                <!-- Bouton -->
                <div class="flex justify-end">
                  <button type="submit" class="btn-primary">
                    Changer le mot de passe
                  </button>
                </div>
              </form>
            </div>

            <!-- Zone de danger -->
            <div class="bg-white rounded-lg p-6 shadow-sm mt-6 border-t-4 border-red-500">
              <h3 class="text-lg font-medium text-red-700 mb-4">Zone de danger</h3>
              <p class="text-gray-500 mb-4">
                La suppression de votre compte est irréversible et entraînera la perte de toutes vos données.
              </p>
              <button (click)="onDeleteAccount()" 
                      class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  profile = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix\n75000 Paris\nFrance',
    notifications: {
      email: true,
      sms: false
    }
  };

  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  onSubmit() {
    // TODO: Implement profile update logic
    console.log('Profile update:', this.profile);
  }

  onChangePassword() {
    // TODO: Implement password change logic
    console.log('Password change:', this.passwordForm);
  }

  onDeleteAccount() {
    // TODO: Implement account deletion logic
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      console.log('Account deletion requested');
    }
  }
}