import { provideStore } from '@ngrx/store';
import { reducers } from './store';

export const ngrxProviders = [
  provideStore(reducers)
];
