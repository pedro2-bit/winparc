import { Component, ChangeDetectorRef } from '@angular/core';
import { AppInitService } from '@core/services/app-init.service';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from './route-animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  animations: [routeAnimations],
  template: `
    <main [@routeAnimations]="getRouteAnimationData(outlet)" class="relative min-h-screen">      
      <router-outlet #outlet="outlet"></router-outlet>
    </main>
  `
})
export class AppComponent {
  name = 'Flash';

  constructor(private cdr: ChangeDetectorRef, private appInitService: AppInitService) {
   // this.appInitService.initialize();
  }


  getRouteAnimationData(outlet: any) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}