import { Provider } from '@angular/core';
import { LocalStorageService } from '../core/services/local-storage.service';
import { createHydrationMetaReducer } from './hydration.metareducer';

export const hydrationMetaReducerProvider: Provider = {
  provide: 'HYDRATION_META_REDUCER',
  deps: [LocalStorageService],
  useFactory: (localStorage: LocalStorageService) => (reducer: any) => createHydrationMetaReducer(localStorage)(reducer)
};
