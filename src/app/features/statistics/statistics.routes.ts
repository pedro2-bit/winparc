import { Routes } from '@angular/router';
import { StatisticsComponent } from './pages/statistics/statistics.component';

export const STATISTICS_ROUTES: Routes = [
  {
    path: '',
    component: StatisticsComponent
  },
  {
    path: 'dashboard',
    component: StatisticsComponent
  }
];