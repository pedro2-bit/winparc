import { createAction, props } from '@ngrx/store';

export const setLanguage = createAction('[Language] Set', props<{ language: string }>());
