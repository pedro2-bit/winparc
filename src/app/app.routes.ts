import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@core/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from '@core/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { provideHttpClient } from '@angular/common/http';
import { RegisterSuccessComponent } from './features/auth/pages/register-success/register-success.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    loadChildren: () => import('./features/statistics/statistics.routes').then(m => m.STATISTICS_ROUTES)
  },
  {
    path: 'wingf',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    providers: [provideHttpClient()],
    children: [
      {
        path: '',
        redirectTo: 'dashboard', pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/statistics/statistics.routes').then(m => m.STATISTICS_ROUTES)
      },
      {
        path: 'forets',
        loadChildren: () => import('./features/forets/forets.routes').then(m => m.foretsRoutes)
      },
      {
        path: 'parcelles',
        loadChildren: () => import('./features/parcelles/parcelles.routes').then(m => m.ParcellesRoutes)
      },
  
      {
        path: 'clients',
        loadChildren: () => import('./features/clients/clients.routes').then(m => m.clientsRoutes)
      },
      
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
      },
    ]
  },
  
  {
    path: 'auth',
    providers: [provideHttpClient()],
    
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/auth/auth.routes')
          .then(m => m.AUTH_ROUTES)
    
  },
  {
    path: 'register-success',
    component: RegisterSuccessComponent
  },
  {
    path: '403',
    loadComponent: () => import('./features/pages/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./features/pages/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '500',
    loadComponent: () => import('./features/pages/server-error.component').then(m => m.ServerErrorComponent)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];