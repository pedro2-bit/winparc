import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TypeTelecomInterface } from '@features/clients/client.interface';

export interface Pays {
  id: string;
  code: string;
  indicatif: string;
  nom: string;
  nomEn: string;
  nomFr: string;
}

/*export interface TypeTelecom{
  id: string;
  code: string;
  libelle: string;
 
}*/

@Injectable({
  providedIn: 'root'
})
export class PaysService {
  //private apiUrl = 'http://192.168.1.132:8080/api/server/pays';

  constructor(private http: HttpClient) {}

  getPays(): Observable<Pays[]> {
    return this.http.get<Pays[]>(`${environment.apiUrl}/server/pays`);
  }
   getTypesPelecoms(){
      return this.http.get<TypeTelecomInterface[]>(`${environment.apiUrl}/server/type-telecom`);
      
    }
} 