import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { PrivilegesResponseInterface } from '../pages/roles/Role.interface';

export interface PrivilegeInterface {
  id: number;
  code: string;
  libelle: string;
  description?: string;
}



@Injectable({ providedIn: 'root' })
export class PrivilegeService {
    private readonly API_URL = `${environment.apiUrl}`;
  
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    // ...existing code...
    'Authorization': `Bearer ${this.localStorage.get<string>('auth_token')}`
  });

    constructor(private localStorage: LocalStorageService,private http: HttpClient) {}

 
  getAllPrivileges(): Observable<PrivilegeInterface> {  
    return this.http.get<any>(`${this.API_URL}/server/privileges`, { headers: this.headers });
  }
  getPrivileges(page: number = 0, size: number = 10): Observable<PrivilegesResponseInterface> {
  
         const params = new HttpParams()
           .set('page', page.toString())
           .set('size', size.toString());
     
        return this.http.get<PrivilegesResponseInterface>(`${this.API_URL}/server/privileges/paginate`, { params, headers: this.headers });
  }
  


  createPrivilege(privilege: { code: string; libelle: string }): Observable<PrivilegeInterface> {
    return this.http.post<PrivilegeInterface>(`${this.API_URL}/server/privileges/create`, privilege).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }
}
