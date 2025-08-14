import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CompanySelectorComponent } from '../../../shared/components/company-selector/company-selector.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl:'./sidebar.component.html',
  styleUrls:['./sidebar.component.scss'],

})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen = true;
  @Input() isCollapsed = true;
  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() companySelected = new EventEmitter<number | null>();
  @Output() siteSelected = new EventEmitter<number>();
  @Output() globalLoader = new EventEmitter<boolean>();
  @Input() selectedCompanyId: number | null = null;

  // État d'expansion des menus
  menuStates = {
  lotsParc: false,
  stock: false,
  administration: false,
  production: false,
};
  private routerEventsSub?: Subscription;
  private authoritiesSub?: Subscription;

  // Méthode pour basculer l'état d'expansion d'un menu
  toggleMenu(menuName: keyof typeof this.menuStates): void {
    this.menuStates[menuName] = !this.menuStates[menuName];
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateMenuStates(this.router.url);
    this.routerEventsSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateMenuStates(event.urlAfterRedirects);
      }
    });

    // Souscription aux changements de authorities pour réévaluer la route active
    const store = (window as any).ng && (window as any).ng.getInjector ? (window as any).ng.getInjector(this) : null;
    // Fallback: import Store dynamiquement si besoin
    let storeInstance = null;
    try {
      // @ts-ignore
      storeInstance = this['store'] || null;
    } catch {}
    if (!storeInstance) {
      try {
        // @ts-ignore
        const { Store } = require('@ngrx/store');
        storeInstance = new Store();
      } catch {}
    }
    if (storeInstance) {
      this.authoritiesSub = storeInstance.select('authorities').subscribe(() => {
        // Réévalue la route active
        this.router.navigateByUrl(this.router.url);
      });
    }
  }

  ngOnDestroy(): void {
    this.routerEventsSub?.unsubscribe();
    this.authoritiesSub?.unsubscribe();
  }

  /**
   * Ouvre le menu parent si la route courante correspond à un sous-menu
   */
  updateMenuStates(url: string) {
    // Réinitialise tout
    Object.keys(this.menuStates).forEach(key => (this.menuStates[key as keyof typeof this.menuStates] = false));

    // Mapping route -> menu
    if (/\/app\/(modules|pays|ressources)/.test(url)) {
      this.menuStates.lotsParc = true;
    }
 
    if (/\/app\/essences?\//.test(url)) {
      this.menuStates.stock = true;
    }
    if (/\/app\/dimension/.test(url)) {
      this.menuStates.administration = true;
    }
    if (/\/app\/cubage/.test(url)) {
      this.menuStates.production = true;
    }
    // Ajoutez d'autres mappings si besoin
  }

  /**
   * Retourne true si le lien correspond à la route active
   */
  isActiveLink(link: string): boolean {
    return this.router.url.startsWith(link);
  }

  onCompanySelected(companyId: number | null) {
    this.companySelected.emit(companyId);
  }

  onSiteSelected(siteId: number) {
    this.siteSelected.emit(siteId);
  }
  onGlobalLoader(state: boolean) {
    this.globalLoader.emit(state);
  }

} 