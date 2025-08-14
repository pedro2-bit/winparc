import { InjectionToken, inject } from '@angular/core';
import { LocalStorageService } from '../core/services/local-storage.service';
import { ActionReducer, INIT, UPDATE, MetaReducer } from '@ngrx/store';
import { AppState } from './index';

export function createHydrationMetaReducer(localStorage: LocalStorageService): MetaReducer<AppState> {
  return function hydrationMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
    return (state, action) => {
      if (action.type === INIT || action.type === UPDATE) {
        const storageValue = localStorage.get<string>('appState');
        if (storageValue) {
          try {
            return JSON.parse(storageValue);
          } catch {
            localStorage.remove('appState');
          }
        }
      }
      const nextState = reducer(state, action);
      localStorage.set('appState', nextState);
      return nextState;
    };
  };
}
