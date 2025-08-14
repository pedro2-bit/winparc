import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { selectAuthorities } from '../../../store/user.selectors';

@Injectable({ providedIn: 'root' })
export class AuthoritiesGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const requiredAuthorities: string[] = route.data['authorities'] || [];
    
    return this.store.pipe(
      select(selectAuthorities),
      take(1),
      map((authorities: string[]) => {
        if (!requiredAuthorities.length || requiredAuthorities.some(auth => authorities.includes(auth))) {
          return true;
        } else {
          this.router.navigate(['/unauthorized']);
          return false;
        }
      })
    );
  }
}
