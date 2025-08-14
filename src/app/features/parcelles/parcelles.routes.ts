import { Routes } from '@angular/router';
import { ParcellesComponent } from './parcelles.component';
import { ParcelleListGuard } from './guards/parcelles-list.guard';
import { ParcelleAddGuard } from './guards/parcelles-add.guard';

export const ParcellesRoutes: Routes = [
  {
    path: '',
    component: ParcellesComponent,
    canActivate: [ParcelleListGuard]
  },
  {
    path: 'add',
    component: ParcelleAddGuard,
    canActivate: [ParcelleAddGuard]

  }
];