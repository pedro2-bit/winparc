import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { RolesResponseInterface } from '../pages/roles/Role.interface';
import { PrivilegeInterface } from '../pages/roles/Role.interface';
import { LocalStorageService } from '../../../core/services/local-storage.service';

export interface Role {
  id?: number;
  code: string;
  libelle: string;
}


@Injectable({ providedIn: 'root' })
export class RoleService {
  private baseUrl = environment.apiUrl;

  API_URL = this.baseUrl+''; // Remplacez par l'URL réelle

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.localStorage.get<number>('auth_token')}`
  });
    private societeId=this.localStorage.get<number>('selectedCompanyId');


  constructor(private localStorage: LocalStorageService, private http: HttpClient) {}

  getRoles(page: number = 0, size: number = 10): Observable<RolesResponseInterface> {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
  
      return this.http.get<RolesResponseInterface>(`${this.API_URL}/server/roles/societe/${this.societeId}/paginate`, { params, headers: this.headers });
    }
    getUnpaginatedRoles(page: number = 0, size: number = 10): Observable<RolesResponseInterface> {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
  
      return this.http.get<RolesResponseInterface>(`${this.API_URL}/server/roles/societe/${this.societeId}`, { headers: this.headers });
    }
    getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.API_URL}/server/roles/${id}`, { headers: this.headers }).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }



  createRole(role: { code: string; libelle: string; privilegeIds?: Number[] }): Observable<Role> {
    // Rafraîchir le token à chaque appel pour éviter un token expiré ou absent
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.localStorage.get<number>('auth_token')}`
    });
    // Send privileges if provided
    const payload: any = { code: role.code, libelle: role.libelle, societeId: this.societeId };
    if (role.privilegeIds) {
      payload.privilegeIds = role.privilegeIds;
      payload.societeID=this.societeId||0
    }
    return this.http.post<any>(`${this.API_URL}/server/roles`, payload, { headers });
  }

}
