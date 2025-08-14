import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="global-loader-backdrop">
      <div class="global-loader-content">
        <span class="global-loader-spinner"></span>
        <span class="global-loader-title">Chargement de l'application</span>
        <span class="global-loader-desc">Veuillez patienter pendant l'initialisation des données...</span>
      </div>
    </div>
  `,
  styleUrls: ['./global-loader.component.scss']
})
export class GlobalLoaderComponent {
  @Input() show = false;
}
