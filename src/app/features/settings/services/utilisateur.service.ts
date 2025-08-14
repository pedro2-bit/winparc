
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RoleInterface } from '../pages/roles/Role.interface';
import { environment } from 'environments/environment';
// ...existing code...

export interface UtilisateurInterface {
  id:number;
  name: string;
  surname: string;
  gender: 'Male' | 'Female' | string;
  email: string;
  mobilePhone: string;
  birthDate: number;
  avatar: string;
  roles: number[];
  isEnable:boolean;
}
export interface UtilisateurDetailInterface {
  id:number;
  username:string,
  name: string;
  surname: string;
  gender: 'Male' | 'Female' | string;
  email: string;
  mobilePhone: string;
  birthDate: number;
  avatar: string;
  roles: RoleInterface[];
  isEnable:boolean;
}
export interface UtilisateursResponseInterface {
  data: UtilisateurInterface[];
  totalItems: number;
  totalPages?: number;
  currentPage?: number;
}
export interface UtilisateurCreateInterface {
  name: string;
  surname: string;
  gender: 'Male' | 'Female' | string;
  email: string;
  mobilePhone: string;
  birthDate: number;
  avatar: string;
  societeID:number;
  roles: number[];
}

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
    private baseUrl = environment.apiUrl;
  
    API_URL = this.baseUrl+''; // Remplacez par l'URL réelle
    constructor(private localStorage: LocalStorageService, private http: HttpClient) {}
    private societeId = this.localStorage.get<number>('selectedCompanyId');
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });



  getUtilisateurs(page: number = 0, size: number = 10): Observable<UtilisateursResponseInterface> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };
    return this.http.get<UtilisateursResponseInterface>(`${this.API_URL}/server/utilisateurs/society/${this.societeId}`, { params }).pipe(
      catchError(() => of({ data: [], totalItems: 0, totalPages: 1, currentPage: page + 1 }))
    );
  }
  getUtilisateurById(id: number): Observable<UtilisateurInterface> {
      return this.http.get<UtilisateurInterface>(`${this.API_URL}/server/utilisateurs/details/${id}/societe/${this.societeId}`).pipe(
        catchError((err) => {
          throw err;
        })
      );
  }
  createUtilisateur(utilisateur: UtilisateurCreateInterface): Observable<UtilisateurInterface> {
    const utilisateurToSend = { ...utilisateur };
    utilisateurToSend.societeID=this.societeId||0
    
    return this.http.post<UtilisateurInterface>(`${this.API_URL}/server/utilisateurs/create`, utilisateurToSend).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }
    activateUtilisateur(id: number): Observable<any> {
    return this.http.put(`${this.API_URL}/server/utilisateurs/${id}/enable/societe/${this.societeId}`, {}).pipe(
      catchError((err) => { throw err; })
    );
  }

  deactivateUtilisateur(id: number): Observable<any> {
    return this.http.put(`${this.API_URL}/server/utilisateurs/${id}/disable/societe/${this.societeId}`, {}).pipe(
      catchError((err) => { throw err; })
    );
  }
}
