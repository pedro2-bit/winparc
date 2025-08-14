import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { LocalStorageService } from '@core/services/local-storage.service';


export interface Company {
  id: number;
  raisonSociale: string;
  codeSociete: string;
  ville: string;
  region: string;
  siret: string;
  capital: string;
  tel: string;
  email: string;
   modules: any[];
}

interface CompanyResponse {
  message: string;
  societes: Company[];
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `${environment.apiUrl}/server/societes/user-have-access`;

  constructor(private localStorage: LocalStorageService, private http: HttpClient) { }

  getCompanies(): Observable<Company[]> {
    
    const token = this.localStorage.get<number>('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<CompanyResponse>(this.apiUrl, { headers }).pipe(
      tap(response => {
        console.log('Sociétés reçues:', response.societes);
      }),
      map(response => response.societes)
    );
  }
}
