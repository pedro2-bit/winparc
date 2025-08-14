import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Site {
  id: number;
  intitule: string;
  codeSite: string;
  telephone: string;
  telecopie: string;
  email: string;
  contact: string;
  piedDocument: string;
  societeId: number;
}

export interface SitesResponse<T> {
  totalItems: number;
  data: T;
  totalPages: number;
  message: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private readonly API_URL = environment.apiUrl;
  constructor(private http: HttpClient, private localStorage: LocalStorageService) {}

  private getHeaders(): HttpHeaders {
    const token = this.localStorage.get<string>('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getSitesBySocieteId(societeId: number): Observable<SitesResponse<Site[]>> {
    return this.http.get<SitesResponse<Site[]>>(`${this.API_URL}/server/sites/societe/${societeId}`, { headers: this.getHeaders() });
  }

  //sites d'une société non-paginé utilisé notamment à la création d'un client.
  getSitesUnpaginatedBySocieteId(societeId: number): Observable<SitesResponse<Site[]>> {
    return this.http.get<SitesResponse<Site[]>>(`${this.API_URL}/server/sites/societe/${societeId}/unpaginated`, { headers: this.getHeaders() });
  }

  getSiteById(siteId: number): Observable<SitesResponse<Site>> {
    return this.http.get<SitesResponse<Site>>(`${this.API_URL}/server/sites/${siteId}`, { headers: this.getHeaders() });
  }
} 