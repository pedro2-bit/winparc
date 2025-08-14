import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientInterface, ClientResponseInterface } from './client.interface';
	import { LocalStorageService } from '@core/services/local-storage.service'

  @Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = `${environment.apiUrl}`;
  private societeId =this.localStorage.get<number>('selectedCompanyId')

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private localStorage: LocalStorageService,private http: HttpClient) {}

  getFilteredClients(query: string = '', page: number = 0, size: number = 10): Observable<ClientResponseInterface> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ClientResponseInterface>(`${this.API_URL}/full`, { params });
  }

  getClientsBySociete(page: number = 0, size: number = 10): Observable<ClientResponseInterface> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ClientResponseInterface>(`${this.API_URL}/server/clients/societe/${this.societeId}/full`, { params });
  }
    getSearchClientBySociete(query: string = '', page: number = 0, size: number = 10): Observable<ClientResponseInterface> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ClientResponseInterface>(`${this.API_URL}/server/clients/societe/${this.societeId}/search`, { params });
  }

  getClientById(id: number): Observable<ClientInterface> {
    return this.http.get<ClientInterface>(`${this.API_URL}/${id}`, { headers: this.headers });
  }

  getClients(page: number = 0, size: number = 10): Observable<ClientResponseInterface> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ClientResponseInterface>(`${this.API_URL}/paginated`, { params, headers: this.headers });
  }
  createClient(client: Partial<ClientInterface>): Observable<{ data: ClientInterface, status: number }> {
    return this.http.post<{ data: ClientInterface, status: number }>(`${this.API_URL}/server/clients`, client, { headers: this.headers });
  }
  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.headers });
  }
  //à définir
  printClient(id: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/print`, {}, { headers: this.headers });
  }

  activerClient(client: ClientInterface): Observable<any> {
    return this.http.put(`${this.API_URL}/server/clients/${client.id}/etat/active`, {}, { headers: this.headers });
  }

  desactiverClient(client: ClientInterface): Observable<any> {
    return this.http.put(`${this.API_URL}/server/clients/${client.id}/etat/desable`, {}, { headers: this.headers });
  }
}