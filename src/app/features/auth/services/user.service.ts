import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../../../core/services/local-storage.service';
export interface UserDetails {
  id: number;
  name: string;
  surname: string;
  username: string;
  gender: string;
  email: string;
  mobilePhone: string;
  birthDate: number;
  avatar: string | null;
}

export interface UserResponse {
  utilisateur: UserDetails;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private localStorage: LocalStorageService, private http: HttpClient) {}

  getUserDetails(): Observable<UserResponse> {
    const token =this.localStorage.get<number>('auth_token');
   return this.http.get<UserResponse>(`${this.apiUrl}/server/utilisateurs/details/me`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des détails utilisateur:', error);
        throw error;
      })
    );
  }

   getUserAuthorizations(societeId:number, utilisateurId:string): Observable<UserResponse> {
    const token = this.localStorage.get<number>('auth_token'); 
   return this.http.get<UserResponse>(`${this.apiUrl}/server/utilisateurs/details/${utilisateurId}/societe/${societeId}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des détails utilisateur:', error);
        throw error;
      })
    );
  }
} 