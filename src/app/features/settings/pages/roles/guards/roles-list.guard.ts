import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthorities } from '../../../../../store/user.selectors';
import { inject } from '@angular/core';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RolesListGuard implements CanActivate {
  private store = inject(Store);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.store.select(selectAuthorities).pipe(
      take(1),
      map((authorities: string[]) => {
        if (authorities && authorities.includes('list_role')) {
          return true;
        }
        this.router.navigate(['/403']);
        return false;
      })
    );
  }
}
