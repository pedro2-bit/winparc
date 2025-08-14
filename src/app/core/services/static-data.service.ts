import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '@core/services/local-storage.service';


export interface TypeSociete {
  id: number;
  code: string;
  libelle: string;
}

export interface EtatClient {
  id: number;
  code: string;
  libelle: string;
}

@Injectable({ providedIn: 'root' })
export class StaticDataService {
    private apiUrl = `${environment.apiUrl}/server/type-societe`;
  

  constructor(private localStorage: LocalStorageService,private http: HttpClient) {}

  getTypeSocietes(){
    const token = this.localStorage.get<number>('auth_token'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      tap(res => {
      }),
      map(res => Array.isArray(res) ? res : (res.typeSocietes || []))
    );
  }

  getEtatClients() {
    const token = this.localStorage.get<number>('auth_token'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${environment.apiUrl}/server/etat-client`;
    return this.http.get<any>(url, { headers }).pipe(
      tap(res => {
      }),
      map(res => Array.isArray(res) ? res : (res.etatClients || []))
    );
  }

  getTypesPelecoms(){

    const url = `${environment.apiUrl}/server/type-telecom`;
    return this.http.get<any>(url).pipe(
      tap(res => {
      }),
      map(res => Array.isArray(res) ? res : (res.typeTelecoms || []))
    );
  }

  getSitesSociete(){
    const token = this.localStorage.get<number>('auth_token'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${environment.apiUrl}/server/sites`;
    return this.http.get<any>(url, { headers }).pipe(
      tap(res => {
      }),
      map(res => Array.isArray(res.data) ? res.data : (res.data.sitesSpciete || []))
    );
  }
}
