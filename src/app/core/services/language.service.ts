import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';

export type AppLanguage = 'fr' | 'en' | 'es' | 'de';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly fallback: AppLanguage = 'fr';
  readonly supported: AppLanguage[] = ['fr', 'en', 'es', 'de'];
  readonly storageKey = 'lang';

  constructor(
    private translate: TranslateService,
    private localStorage: LocalStorageService
  ) {
    const browserLang = navigator.language.split('-')[0] as AppLanguage;
    const savedLang = this.localStorage.get<string>(this.storageKey) as AppLanguage;
    const lang = this.supported.includes(savedLang)
      ? savedLang
      : (this.supported.includes(browserLang) ? browserLang : this.fallback);
    this.setLanguage(lang);
  }

  setLanguage(lang: AppLanguage) {
    if (!this.supported.includes(lang)) lang = this.fallback;
    this.translate.use(lang);
    this.localStorage.set(this.storageKey, lang);
  }

  getLanguage(): AppLanguage {
    return (this.translate.currentLang as AppLanguage) || this.fallback;
  }
}
