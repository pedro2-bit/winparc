import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ForetInterface, ForetInterfaceCreation, ForetResponseInterface } from './foret.interface'
	import { LocalStorageService } from '@core/services/local-storage.service'

  @Injectable({
  providedIn: 'root'
})
export class ForetService {
  private readonly API_URL = `${environment.apiUrl}`;
  private societeId =this.localStorage.get<number>('selectedCompanyId')

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private localStorage: LocalStorageService,private http: HttpClient) {}

  getFilteredForets(query: string = '', page: number = 0, size: number = 10): Observable<ForetResponseInterface> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ForetResponseInterface>(`${this.API_URL}/full`, { params });
  }

  getForetsBySociete(page: number = 0, size: number = 10): Observable<ForetResponseInterface> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ForetResponseInterface>(`${this.API_URL}/server/Forets/societe/${this.societeId}/full`, { params });
  }
    getSearchForetBySociete(query: string = '', page: number = 0, size: number = 10): Observable<ForetResponseInterface> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ForetResponseInterface>(`${this.API_URL}/server/Forets/societe/${this.societeId}/search`, { params });
  }

  getForetById(id: number): Observable<ForetResponseInterface> {
    return this.http.get<ForetResponseInterface>(`${this.API_URL}/${id}`, { headers: this.headers });
  }

  getForets(page: number = 0, size: number = 10): Observable<ForetResponseInterface> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ForetResponseInterface>(`${this.API_URL}/paginated`, { params, headers: this.headers });
  }
  createForet(Foret: Partial<ForetInterfaceCreation>): Observable<{ data: ForetInterfaceCreation, status: number }> {
    return this.http.post<{ data: ForetInterfaceCreation, status: number }>(`${this.API_URL}/server/Forets`, Foret, { headers: this.headers });
  }
  updateForet(id: number, Foret: Partial<ForetResponseInterface>): Observable<ForetResponseInterface> {
    return this.http.put<ForetResponseInterface>(`${this.API_URL}/${id}`, Foret, { headers: this.headers });
  }
  deleteForet(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.headers });
  }
  //à définir
  printForet(id: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/print`, {}, { headers: this.headers });
  }

  activerForet(foret: ForetInterface): Observable<any> {
    return this.http.put(`${this.API_URL}/server/Forets/${foret.id}/etat/active`, {}, { headers: this.headers });
  }

  desactiverForet(foret: ForetInterface): Observable<any> {
    return this.http.put(`${this.API_URL}/server/Forets/${foret.id}/etat/desable`, {}, { headers: this.headers });
  }
}