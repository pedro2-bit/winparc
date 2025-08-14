
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { LocalStorageService } from '@core/services/local-storage.service';


export interface Utilisateur {
  id: number;
  name: string;
  surname: string;
  username: string;
  gender: string;
  email: string;
  mobilePhone: string;
  birthDate: number;
  avatar: string | null;
  societes: societe[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/server/utilisateurs/details/me`;

  constructor(private localStorage: LocalStorageService, private http: HttpClient) { }

  getUserData() {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(user => {
        console.log('Utilisateur reçu:', user.utilisateur);
      }),
      map(user => user.utilisateur)
    );
  }

  keepCurrentPassword(): Observable<any> {
    const token =this.localStorage.get<number>('auth_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${environment.apiUrl}/server/utilisateurs/keep-my-password`, {}, { headers });
  }
}

export interface societe {
    id: number;
    raisonSociale: string;
    codeSociete: string;
    capital: string;
}
