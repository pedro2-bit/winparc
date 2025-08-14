import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ServerAvailabilityInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: any) => {
        // Affiche la notification si le serveur est injoignable (timeout, net::ERR_CONNECTION_TIMED_OUT, etc.)
        if (
          (error instanceof HttpErrorResponse && (error.status === 0 || error.status === 503)) ||
          (error && error.message && error.message.toLowerCase().includes('unknown error')) ||
          (error && error.error && error.error.type === 'error')
        ) {
          this.notificationService.showInfo('Serveur indisponible');
        }
        return throwError(() => error);
      })
    );
  }
}
