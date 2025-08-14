import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ServerAvailabilityInterceptor } from './core/interceptors/server-availability.interceptor';
import { routes } from './app.routes';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideStore } from '@ngrx/store';
import { reducers } from './store/index';
import { hydrationMetaReducerProvider } from './store/hydration.metareducer.provider';
import { i18nProviders } from './core/i18n.providers';
import { authTokenInterceptor } from './core/auth-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    ...i18nProviders,
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authTokenInterceptor
      ]),
      withInterceptorsFromDi()
    ),
    ServerAvailabilityInterceptor,
    hydrationMetaReducerProvider,
    {
      provide: 'META_REDUCERS',
      deps: ['HYDRATION_META_REDUCER'],
      useFactory: (hydrationMetaReducer: any) => [hydrationMetaReducer]
    },
    provideStore(
      reducers,
      {
        metaReducers: [
          // Will be replaced by the factory above
        ]
      }
    ),
    provideAnimations()
  ]
};