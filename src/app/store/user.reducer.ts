import { createReducer, on } from '@ngrx/store';
import { setUser, clearUser, setSelectedSociete, setAuthorities } from './user.actions';
import { Utilisateur } from '../core/services/user.service';

export interface societe {
  id: number;
  raisonSociale: string;
  codeSociete: string;
  capital: string;
  siret: string;
  modules: any[];
  // ...other properties...
}


export interface UserState {
  user: Utilisateur | null;
  selectedSociete: societe | null;
  authorities: string[];
}


export const initialState: UserState = {
  user: null,
  selectedSociete: null,
  authorities: []
};

export const userReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({ ...state, user })),
  on(clearUser, state => ({ ...state, user: null, selectedSociete: null, authorities: [] })),
  on(setSelectedSociete, (state, { societe }) => ({ ...state, selectedSociete: societe })),
  on(setAuthorities, (state, { authorities }) => ({ ...state, authorities }))
);
