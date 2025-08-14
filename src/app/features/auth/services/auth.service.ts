import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { setUser } from '../../../store/user.actions';
import { UserService } from '../../../core/services/user.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private store: Store,
    private localStorage: LocalStorageService
  ) {
    this.isAuthenticatedSubject.next(this.checkAuth());
    this.restoreUserState();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/authenticate`, {
      username,
      password
    });
  }

  private setCookie(name: string, value: string, days: number = 365): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/; domain=localhost; SameSite=None; Secure`;
  }

  getSharedCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  handleLoginResponse(response: any): void {
    console.log('response', response);
    if (response.jwt) {
      console.log('jwt', response.jwt);
      this.setCookie('auth_token', response.jwt);
      this.localStorage.set('auth_token', response.jwt);
      sessionStorage.setItem('auth_token', response.jwt);
      this.isAuthenticatedSubject.next(true);

      // Récupérer les infos utilisateur et les stocker dans le store et le LocalStorage
      this.userService.getUserData().subscribe(user => {
        this.store.dispatch(setUser({ user }));
        this.localStorage.set('user_state', user);
        this.router.navigate(['/app/dashboard']);
      });
    }
  }

  /**
   * Restaure le user state depuis le LocalStorage au démarrage
   */
  private restoreUserState(): void {
    const user = this.localStorage.get<any>('user_state');
    if (user) {
      this.store.dispatch(setUser({ user }));
    }
  }

  checkAuth(): boolean {
    console.log('checkAuth', this.getSharedCookie('auth_token'));
    if (this.getSharedCookie('auth_token') || this.localStorage.get<string>('auth_token')) {
      return true;
    }
    return false;
  }

  logout(): void {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    sessionStorage.removeItem('auth_token');
    this.localStorage.remove('auth_token');
    this.localStorage.remove('selectedCompanyId');
    // Mettre tous les objets du store à null (ici, on clear l'utilisateur)
    this.store.dispatch({ type: '[Auth] Clear User' });
    // this.isAuthenticatedSubject.next(false);
    window.location.href = environment.authLogoutUrl;
  }
} 