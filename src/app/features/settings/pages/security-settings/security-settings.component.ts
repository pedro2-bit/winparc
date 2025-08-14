import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-6">Paramètres de sécurité</h2>
      
      <div class="space-y-6">
        <!-- Authentification à deux facteurs -->
        <div class="border-b pb-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Authentification à deux facteurs</h3>
              <p class="text-sm text-gray-500 mt-1">
                Ajoutez une couche de sécurité supplémentaire à votre compte
              </p>
            </div>
            <button class="btn-secondary">
              Configurer
            </button>
          </div>
        </div>

        <!-- Sessions actives -->
        <div class="border-b pb-6">
          <h3 class="text-sm font-medium text-gray-900 mb-4">Sessions actives</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900">Windows 10 - Chrome</p>
                  <p class="text-xs text-gray-500">Dernière activité: Il y a 2 minutes</p>
                </div>
              </div>
              <button class="text-sm text-red-600 hover:text-red-500">
                Déconnecter
              </button>
            </div>
          </div>
        </div>

        <!-- Historique des connexions -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-4">Historique des connexions</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-900">Paris, France</p>
                <p class="text-xs text-gray-500">15 mars 2024, 14:30</p>
              </div>
              <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                Réussie
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SecuritySettingsComponent {} 