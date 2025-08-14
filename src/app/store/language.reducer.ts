import { createReducer, on } from '@ngrx/store';
import { setLanguage } from './language.actions';

export interface LanguageState {
  language: string;
}

const initialState: LanguageState = {
  language: localStorage.getItem('app_language') || 'fr'
};

export const languageReducer = createReducer(
  initialState,
  on(setLanguage, (state, { language }) => {
    localStorage.setItem('app_language', language);
    return { ...state, language };
  })
);
