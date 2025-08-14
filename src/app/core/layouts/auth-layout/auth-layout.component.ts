import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from '../../../route-animations';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  animations: [routeAnimations],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <main [@routeAnimations]="getRouteAnimationData(outlet)" class="w-full">
        <router-outlet #outlet="outlet" />
      </main>
    </div>
  `
})
export class AuthLayoutComponent {
  getRouteAnimationData(outlet: any) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}