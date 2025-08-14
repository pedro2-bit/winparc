import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ParcelleInterface, ParcelleResponseInterface } from './parcelle.interface'
	import { LocalStorageService } from '@core/services/local-storage.service'

  @Injectable({
  providedIn: 'root'
})
export class Parcelleservice {
  private readonly API_URL = `${environment.apiUrl}`;
  private societeId =this.localStorage.get<number>('selectedCompanyId')

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private localStorage: LocalStorageService,private http: HttpClient) {}

  getFilteredParcelles(query: string = '', page: number = 0, size: number = 10): Observable<ParcelleResponseInterface> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ParcelleResponseInterface>(`${this.API_URL}/full`, { params });
  }

  getParcellesBySociete(page: number = 0, size: number = 10): Observable<ParcelleResponseInterface> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ParcelleResponseInterface>(`${this.API_URL}/server/Parcelles/societe/${this.societeId}/full`, { params });
  }
    getSearchParcelleBySociete(query: string = '', page: number = 0, size: number = 10): Observable<ParcelleResponseInterface> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ParcelleResponseInterface>(`${this.API_URL}/server/Parcelles/societe/${this.societeId}/search`, { params });
  }

  getParcelleById(id: number): Observable<ParcelleResponseInterface> {
    return this.http.get<ParcelleResponseInterface>(`${this.API_URL}/${id}`, { headers: this.headers });
  }

  getParcelles(page: number = 0, size: number = 10): Observable<ParcelleResponseInterface> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ParcelleResponseInterface>(`${this.API_URL}/paginated`, { params, headers: this.headers });
  }
  createParcelle(Parcelle: Partial<ParcelleResponseInterface>): Observable<{ data: ParcelleResponseInterface, status: number }> {
    return this.http.post<{ data: ParcelleResponseInterface, status: number }>(`${this.API_URL}/server/Parcelles`, Parcelle, { headers: this.headers });
  }
  deleteParcelle(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.headers });
  }
  //à définir
  printParcelle(id: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/print`, {}, { headers: this.headers });
  }

  activerParcelle(foret: ParcelleInterface): Observable<any> {
    return this.http.put(`${this.API_URL}/server/Parcelles/${foret.id}/etat/active`, {}, { headers: this.headers });
  }

  desactiverParcelle(foret: ParcelleInterface): Observable<any> {
    return this.http.put(`${this.API_URL}/server/Parcelles/${foret.id}/etat/desable`, {}, { headers: this.headers });
  }
}