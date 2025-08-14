
export const setAuthorities = createAction(
  '[Auth] Set Authorities',
  props<{ authorities: string[] }>()
);
import { createAction, props } from '@ngrx/store';
import { Utilisateur } from '../core/services/user.service';


export const setUser = createAction(
  '[Auth] Set User',
  props<{ user: Utilisateur }>()
);

export const clearUser = createAction('[Auth] Clear User');

export const setSelectedSociete = createAction(
  '[Company] Set Selected Societe',
  props<{ societe: societe }>());

export interface societe {
  id: number;
  raisonSociale: string;
  codeSociete: string;
  capital: string;
  siret: string;
  modules: any[];
  // ...other properties...
}
