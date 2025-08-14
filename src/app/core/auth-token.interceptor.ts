

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorage = inject(LocalStorageService);
  const token = localStorage.get<string>('auth_token');
  const router = inject(Router);
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(authReq).pipe(
    catchError((error: any) => {
      if (error.status === 403) {
        router.navigate(['/403']);
      } else if (error.status === 404) {
        router.navigate(['/404']);
      } else if (error.status === 500) {
        router.navigate(['/500']);
      }
      throw error;
    })
  );
};
