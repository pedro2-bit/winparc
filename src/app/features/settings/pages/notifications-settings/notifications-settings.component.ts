import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notifications-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-6">Paramètres de notifications</h2>
      
      <form class="space-y-6">
        <!-- Notifications par email -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-700">Notifications par email</h3>
          <div class="space-y-3">
            <div class="flex items-center">
              <input type="checkbox" id="newOrder" class="form-checkbox" />
              <label for="newOrder" class="ml-3 text-sm text-gray-700">
                Nouvelle commande
              </label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="orderStatus" class="form-checkbox" />
              <label for="orderStatus" class="ml-3 text-sm text-gray-700">
                Changement de statut des commandes
              </label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="security" class="form-checkbox" />
              <label for="security" class="ml-3 text-sm text-gray-700">
                Alertes de sécurité
              </label>
            </div>
          </div>
        </div>

        <!-- Notifications push -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-700">Notifications push</h3>
          <div class="space-y-3">
            <div class="flex items-center">
              <input type="checkbox" id="pushNewOrder" class="form-checkbox" />
              <label for="pushNewOrder" class="ml-3 text-sm text-gray-700">
                Nouvelle commande
              </label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="pushOrderStatus" class="form-checkbox" />
              <label for="pushOrderStatus" class="ml-3 text-sm text-gray-700">
                Changement de statut des commandes
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button type="submit" class="btn-primary">
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  `
})
export class NotificationsSettingsComponent {} 