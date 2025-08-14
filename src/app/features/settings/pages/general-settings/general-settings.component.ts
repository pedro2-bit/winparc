import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Paramètres généraux</h2>
      <!-- Contenu des paramètres généraux -->
    </div>
  `
})
export class GeneralSettingsComponent {} 