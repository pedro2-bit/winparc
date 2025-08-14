import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { GlobalLoaderComponent } from '@shared/components/global-loader.component';
import { AppInitService } from '@core/services/app-init.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent, GlobalLoaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex relative overscroll-none">
      <app-global-loader [show]="showGlobalLoader"></app-global-loader>
      <!-- Overlay pour mobile -->
      <div 
        *ngIf="isSidebarOpen" 
        class="fixed inset-0 bg-gray-900 bg-opacity-50 lg:hidden z-10"
        (click)="toggleSidebar()">
      </div>
      
      <app-sidebar 
        [isOpen]="isSidebarOpen"
        [isCollapsed]="isSidebarCollapsed"
        (toggleCollapse)="toggleSidebarCollapse()"
        (globalLoader)="onGlobalLoader($event)"
      />
      
      <div class="flex-1" [class.lg:ml-0]="!isSidebarCollapsed" [class.lg:ml-0]="isSidebarCollapsed">
        <app-navbar 
          [title]="pageTitle" 
          [isSidebarOpen]="isSidebarOpen"
          (toggleSidebar)="toggleSidebar()" />
          
        <main class="h-[calc(100vh-64px)] overflow-y-auto overscroll-none pb-20">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  @Input() pageTitle = '';
  isSidebarOpen = false;
  isSidebarCollapsed = false;
  showGlobalLoader = false;

  constructor(private cdr: ChangeDetectorRef, private appInitService: AppInitService) {}

  ngOnInit() {
    this.appInitService.initialize((show) => {
      this.showGlobalLoader = show;
      this.cdr.detectChanges();
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.toggleSidebarCollapse();
  }

  onGlobalLoader(state: boolean) {
    this.showGlobalLoader = state;
    this.cdr.detectChanges();
  }

  toggleSidebarCollapse() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}