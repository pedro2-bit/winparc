import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { selectLanguage } from 'app/store/language.selectors';
import { setLanguage } from 'app/store/language.actions';
import { Subscription } from 'rxjs';

interface Country {
  id: string;
  text: string;
  flag: string;
  logoUrl: string;
}

@Component({
  selector: 'app-country-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative inline-block w-full max-w-xs" tabindex="0" (blur)="open = false">
      <button
        class="flex items-center w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-150"
        (click)="toggleDropdown()" [attr.aria-expanded]="open"
      >
        <img [src]="selectedLogoUrl" alt="logo" class="w-6 h-6 rounded object-cover mr-2 shadow-sm border border-gray-100" />
        <span class="font-medium text-gray-800 text-base truncate">{{ selectedText }}</span>
        <svg class="ml-auto w-4 h-4 text-gray-400 transition-transform duration-150" [ngClass]="{'rotate-180': open}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div *ngIf="open" class="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in flex flex-col max-h-60 overflow-y-auto">
        <button
          *ngFor="let country of countries"
          (click)="select(country)"
          [class.bg-primary-50]="selectedCountry === country.id"
          class="flex items-center w-full px-3 py-2 text-left hover:bg-primary-50 focus:bg-primary-100 transition-colors duration-100"
        >
          <img [src]="country.logoUrl" alt="logo" class="w-6 h-6 rounded object-cover mr-2 border border-gray-100" />
          <span class="font-medium text-gray-700 text-base truncate">{{ country.text }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @media (max-width: 640px) {
      :host ::ng-deep .max-w-xs { max-width: 100% !important; }
      :host ::ng-deep .w-full { width: 100% !important; }
      :host ::ng-deep .text-base { font-size: 0.95rem !important; }
      :host ::ng-deep .px-3 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
      :host ::ng-deep .py-2 { padding-top: 0.4rem !important; padding-bottom: 0.4rem !important; }
      :host ::ng-deep .w-6, :host ::ng-deep .h-6 { width: 1.25rem !important; height: 1.25rem !important; }
    }
    .animate-fade-in { animation: fadeIn 0.18s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
    .bg-primary-50 { background-color: #e6f0ff !important; }
    .hover\:bg-primary-50:hover { background-color: #e6f0ff !important; }
    .focus\:bg-primary-100:focus { background-color: #cce0ff !important; }
    .border-primary-500 { border-color: #2563eb !important; }
    .focus\:ring-primary-200:focus { box-shadow: 0 0 0 2px #bfdbfe !important; }
  `]
})
export class CountrySelectComponent implements OnInit, OnDestroy {
  open = false;
  selectedCountry: string = 'fr';
  countries: Country[] = [
    { id: 'fr', text: 'FR', flag: '🇫🇷', logoUrl: '/images/fr.png' },
    { id: 'de', text: 'DE', flag: '🇩🇪', logoUrl: '/images/de.png' },
    { id: 'es', text: 'ES', flag: '🇪🇸', logoUrl: '/images/es.png' },
    { id: 'en', text: 'GB', flag: '🇬🇧', logoUrl: '/images/gb.png' }
  ];
  private langSub?: Subscription;

  constructor(
    private translate: TranslateService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.langSub = this.store.select(selectLanguage).subscribe(lang => {
      if (lang && lang !== this.selectedCountry) {
        this.selectedCountry = lang;
        this.translate.use(lang);
      }
    });
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  get selectedText() {
    return this.countries.find(c => c.id === this.selectedCountry)?.text || '';
  }
  get selectedLogoUrl() {
    return this.countries.find(c => c.id === this.selectedCountry)?.logoUrl || '';
  }
  toggleDropdown() { this.open = !this.open; }
  select(country: Country) {
    if (this.selectedCountry !== country.id) {
      this.store.dispatch(setLanguage({ language: country.id }));
      // Le reducer met à jour localStorage et le selecteur met à jour ngx-translate
    }
    this.open = false;
  }
}
