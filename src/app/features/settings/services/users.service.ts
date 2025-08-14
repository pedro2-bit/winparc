import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'environments/environment';
import { UserProfile } from './user.service';

interface ApiUsersResponse {
  data: UserProfile[];
  message: string;
  status: number;
}

interface Profile {
  id: string;
  libelle: string;
  description: string;
}

interface ApiProfilesResponse {
  data: Profile[];
  message: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = environment.apiUrl;
  private apiUrl = this.baseUrl + '/utilisateur/all';
  private profilesUrl = this.baseUrl + '/flash-api/profile/all';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserProfile[]> {
    return this.http.get<ApiUsersResponse>(this.apiUrl)
      .pipe(
        map(response => {
          if (!response.data) {
            console.error('Données manquantes dans la réponse:', response);
            return [];
          }
          return response.data;
        })
      );
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/utilisateur`, userData);
  }

  getProfiles(): Observable<Profile[]> {
    return this.http.get<ApiProfilesResponse>(this.profilesUrl)
      .pipe(
        map(response => {
          if (!response.data) {
            console.error('Données manquantes dans la réponse:', response);
            return [];
          }
          return response.data;
        })
      );
  }
} 