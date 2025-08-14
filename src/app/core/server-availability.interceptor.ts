import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from './services/notification.service';

export const serverAvailabilityInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  return next(req).pipe(
    // catchError is imported from rxjs/operators
    require('rxjs').catchError((error: any) => {
      console.log('error interceptor', error);
      
      if (error.status === 0 || error.status === 503) {
        notificationService.showInfo('Serveur indisponible');
      }
      throw error;
    })
  );
};
