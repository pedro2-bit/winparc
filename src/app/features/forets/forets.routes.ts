import { Routes } from '@angular/router';
import { ForetsComponent } from './forets.component';
import { ForetsListGuard } from './guards/forets-list.guard';

export const foretsRoutes: Routes = [
  {
    path: '',
    component: ForetsComponent,
    canActivate: [ForetsListGuard]
  }

];