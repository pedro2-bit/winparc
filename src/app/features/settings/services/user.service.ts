import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'environments/environment';

export interface UserProfile {
  id: string;
  profile: {
    libelle: string;
    description: string;
  };
  nom: string;
  prenom: string;
  email: string;
  login: string;
}

interface ApiResponse {
  data: UserProfile;
  message: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl;
  private apiUrl = this.baseUrl + '/server/utilisateurs';

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {}

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<ApiResponse>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }
  getUserDetails(): Observable<ApiResponse> {
    const token = this.localStorage.get<string>('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ApiResponse>(`${this.apiUrl}/details/me`, { headers }).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des détails utilisateur:', error);
        throw error;
      })
    );
  }
  getUserProfil(): Observable<ApiResponse> {
    const token = this.localStorage.get<string>('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ApiResponse>(`${this.apiUrl}/details/profile`, { headers }).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des détails utilisateur:', error);
        throw error;
      })
    );
  }
  changePassword(payload: { currentPassword: string; newPassword: string }): Observable<void> {
    const token = this.localStorage.get<string>('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.apiUrl}/change-my-password`, payload, { headers });
  }
}