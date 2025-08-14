import { Routes } from '@angular/router';
import { ClientsComponent } from './clients.component';
import { ClientAddComponent } from './client-add.component';
import { ClientListGuard } from './guards/clients-list.guard';
import { ClientAddGuard } from './guards/clients-add.guard';

export const clientsRoutes: Routes = [
  {
    path: '',
    component: ClientsComponent,
    canActivate: [ClientListGuard]
  },
  {
    path: 'add',
    component: ClientAddComponent,
    canActivate: [ClientAddGuard]

  }
];