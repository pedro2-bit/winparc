import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { userReducer, UserState } from './user.reducer';
import { languageReducer, LanguageState } from './language.reducer';

export interface AppState {
  user: UserState;
  language: LanguageState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  language: languageReducer
};
