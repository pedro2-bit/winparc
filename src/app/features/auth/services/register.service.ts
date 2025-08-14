import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TelecomInterface } from '@features/clients/client.interface';
export interface Societe {
  email: string;
  raisonSociale: string;
  manager: string;
  tel: string;
  codeSociete: string;
  adresse: string;
  region: string;
  pays: string;
  codePostal: string;
  ville: string;
  rue:string;
  capital: string;
  siret: string;
  naf: string;
  idIntraCom: string;
  numCtba: string;
  numPefc: string;
  numCe: string;
  telecoms: TelecomInterface[];
}
export interface SocieteBD {
  email: string;
  raisonSociale: string;
  manager: string;
  tel: string;
  codeSociete: string;
  region: string;
  pays: string;
  codePostal: string;
  ville: string;
  rue:string;
  capital: string;
  siret: string;
  naf: string;
  idIntraCom: string;
  numCtba: string;
  numPefc: string;
  numCe: string;
  adresse: adresseSociete;
  telecoms: TelecomInterface[];
}

export interface adresseSociete{
  id: number;
  rue: string;
  codePostal: string;
  ville: string;
  nomPays: string
}



@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = `${environment.apiUrl}/server/societes`;

  constructor(private http: HttpClient) {}

  registerSociete(societe: Societe): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.apiUrl, societe, { headers });
  }
} 