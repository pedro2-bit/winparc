
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
);

export const selectSelectedSociete = createSelector(
  selectUserState,
  (state: UserState) => state.selectedSociete
);

export const selectAuthorities = createSelector(
  selectUserState,
  (state: UserState) => state.authorities
);
