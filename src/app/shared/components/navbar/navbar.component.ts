import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { HostListener } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUser, selectSelectedSociete } from '../../../store/user.selectors';
import { Utilisateur } from '../../../core/services/user.service';
import { CountrySelectComponent } from '../country-select/country-select.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, CountrySelectComponent],
  template: `
    <nav class="bg-white border-gray-200 border-b fixed  px-4 lg:px-6 py-2.5  left-0 right-0 top-0 z-50">
        <div class="flex flex-wrap justify-between items-center">
            <div class="flex justify-start items-center">
                <button   (click)="toggleSidebar.emit()"  class="hidden p-2 mr-3 text-gray-600 rounded cursor-pointer lg:inline hover:text-gray-900 hover:bg-primary/5  ">
                  <svg class="w-5 h-5"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h14M1 6h14M1 11h7"/> </svg>
                </button>
                <button  (click)="toggleSidebar.emit()" class="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer lg:hidden hover:text-gray-900 hover:bg-sky-100 focus:bg-gray-100  focus:ring-2 focus:ring-gray-100   ">
                  <svg class="w-[18px] h-[18px]"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/></svg>
                  <span class="sr-only">Toggle sidebar</span>
                </button>
                <a  class="flex mr-4">
                  <img src="/images/winparc.png" class="mr-3 h-8" alt="InfoSYLVE Logo" />
                  <span class="self-center text-2xl fon font-bold whitespace-nowrap text-primary-900 ">winPARC</span>
                </a>
                <form action="#" method="GET" class="hidden lg:block lg:pl-2">
                  <label for="topbar-search" class="sr-only">Search</label>
                  <div class="relative mt-1 lg:w-96">
                    <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 "  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/> </svg>
                    </div>
                    <input type="text" name="email"  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary/10 focus:border-primary-500 block w-full pl-9 p-2.5   " placeholder="Search">
                  </div>
                </form>
              </div>
            <div class="flex items-center lg:order-2">
                <button id="toggleSidebarMobileSearch" type="button" class="p-2 text-gray-500 rounded-lg lg:hidden hover:text-gray-900 hover:bg-primary/5  ">
                    <span class="sr-only">Search</span>
                    <!-- Search icon -->
                      <svg class="w-4 h-4"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                </button>
                <!-- Notifications -->
                <button type="button" class="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-primary/5    focus:ring-4 focus:ring-primary/5 ">
                    <span class="sr-only">View notifications</span>
                    <!-- Bell icon -->
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20"><path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"/></svg>
                </button>
                <!-- Country/Language Select Dropdown -->
                <app-country-select class="ml-2"></app-country-select>
                
                <!-- Apps -->
                <button (click)="toggleAppsMenu()" type="button"   class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100    focus:ring-4 focus:ring-primary/5 ">
                    <span class="sr-only">View apps</span>
                    <!-- Icon -->
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                      <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                    </svg>              
                  </button>

                   <!-- Dropdown menu -->
          <div *ngIf="isAppsMenuOpen" 
            class="absolute top-10 right-4 overflow-hidden z-50 my-4 max-w-sm text-base list-none bg-white  divide-y divide-gray-100 shadow-lg  rounded-xl"
            id="apps-dropdown"
          >
            <div
              class="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-primary/10"
            >
              Applications
            </div>
            <div class="grid grid-cols-3 gap-4 p-4">
              @for (item of apps; track $index) {
                <a
                href="{{item.url}}" target="_blank" rel="noopener noreferrer"
                class="block p-4 text-center rounded-lg hover:bg-primary/15 group"
              >
                <img
                  src="{{item.logoUrl}}"
                  class="mx-auto mb-1 w-7 h-7 text-gray-400 group-hover:text-primary/15  "
                  
                />
                <div class="text-sm text-gray-900 ">{{item.name}}</div>
              </a>
              }
            </div>
          </div>
                
                <button  (click)="toggleUserMenu()"  type="button" class="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-primary/5 " >
                    <span class="sr-only">Open user menu</span>
                    @if (isLoading) {
                      <div class="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                    } @else if (userDetails?.avatar) {
                      <img [src]="userDetails?.avatar" class="w-8 h-8 rounded-full object-cover" alt="Avatar utilisateur">
                    } @else {
                      <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
                        {{ getInitials() }}
                      </div>
                    }
                </button>
                <!-- Popover Menu -->
             <div *ngIf="isUserMenuOpen" 
                class="absolute right-3 top-12 z-50  w-56 text-base list-none bg-white  divide-y divide-gray-100 shadow rounded-xl">
                <div class="py-3 px-4">
                  <ng-container *ngIf="user$ | async as user; else loadingOrError">
                    <span class="block text-sm font-semibold text-gray-900">
                      {{user.name}} {{user.surname}}
                    </span>
                    <span class="block text-sm text-gray-900 truncate">
                      {{user.email}}
                    </span>
                  </ng-container>
                  <ng-template #loadingOrError>
                    <div *ngIf="isLoading" class="animate-pulse">
                      <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div *ngIf="error && !isLoading" class="text-red-500 text-sm">
                      Erreur lors du chargement des informations
                    </div>
                  </ng-template>
                </div>
                <ul class="py-1 text-gray-700">
                  <li>
                    <a routerLink="/app/settings/profile" 
                      class="block py-2 px-4 text-sm hover:bg-primary/5">
                      Profil
                    </a>
                  </li>
                  <li>
                    <a routerLink="/app/settings" 
                      class="block py-2 px-4 text-sm hover:bg-primary/5">
                      Parametres
                    </a>
                  </li>
                </ul>
                <ul class="py-1 text-gray-700">
                  <li>
                    <a (click)="logout()" class="block py-2 px-4 text-sm hover:bg-primary/5">
                      Déconnexion
                    </a>
                  </li>
                </ul>
              </div>
            </div>
        </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 10;
    }
  `]
})
export class NavbarComponent implements OnInit {
  @Input() title = '';
  @Input() isSidebarOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  
  isUserMenuOpen = false;
  isAppsMenuOpen = false;
  isLoading = false;
  error = false;
  user$: Observable<Utilisateur | null>;
  userDetails: Utilisateur | null = null;

  apps: AppMenu[] = [];
  selectedSocieteModules: any[] = [];

  constructor(
    private authService: AuthService,
    private store: Store
  ) {
    this.user$ = this.store.pipe(select(selectUser));
    this.store.pipe(select(selectSelectedSociete)).subscribe(societe => {
      if (societe && societe.modules) {
        this.apps = societe.modules.map((mod: any) => {
          let url = '#';
          switch (mod.libelle) {
            case 'InfoNego':
              url = 'http://localhost:4202';
              break;
            case 'InfoSylve':
              url = 'http://localhost:4201';
              break;
            case 'WinCBI':
              url = 'http://localhost:4203';
              break;
            case 'WinCOUPE':
              url = 'http://localhost:4204';
              break;
            default:
              url = '#';
          }
          return {
            name: mod.libelle,
            logoUrl: `/images/${mod.code.toLowerCase()}.png`,
            url
          };
        });
      } else {
        this.apps = [];
      }
    });
  }

  ngOnInit() {
    // Optionnel : garder la logique userDetails si tu en as encore besoin ailleurs
    this.user$.subscribe(user => {
      this.userDetails = user;
    });
  }

  getInitials(): string {
    if (!this.userDetails?.name || !this.userDetails?.surname) return '';
    const firstInitial = this.userDetails.name.charAt(0);
    const lastInitial = this.userDetails.surname.charAt(0);
    return `${firstInitial}${lastInitial}`;
  }

  // Suppression de la méthode loadUserDetails : les données sont désormais dans le store

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleAppsMenu() {
    this.isAppsMenuOpen = !this.isAppsMenuOpen;
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isUserMenuOpen = false;
      this.isAppsMenuOpen=false;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    setTimeout(() => {
      this.isUserMenuOpen = false;
      this.isAppsMenuOpen=false;
    }, 200);
  }
} 

interface AppMenu{
  name:string,
  logoUrl:string,
  url?: string
}