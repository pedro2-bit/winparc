import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SocieteBD } from '../../services/register.service';
import { LocalStorageService } from '@core/services/local-storage.service';

@Component({
  selector: 'app-register-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <div class="card w-full max-w-4xl p-8">
        <div class="text-center mb-8">
          <img src="/images/infosylve.png" alt="logo" class="w-10 h-10 rounded-xl mx-auto">
          <h2 class="mt-4 text-2xl font-bold text-gray-900">Inscription réussie !</h2>
        </div>

        <div *ngIf="societe" class="bg-white rounded-lg shadow p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Récapitulatif de votre société</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Raison Sociale</p>
              <p class="text-gray-900">{{ societe.raisonSociale }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Manager</p>
              <p class="text-gray-900">{{ societe.manager }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Email</p>
              <p class="text-gray-900">{{ societe.email }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Téléphone</p>
              <p class="text-gray-900">{{ societe.tel }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Adresse</p>
              <div class="text-gray-900">
                <span *ngIf="societe.adresse.rue">{{ societe.adresse.rue }}, </span>
                <span *ngIf="societe.adresse.codePostal">{{ societe.adresse.codePostal }} </span>
                <span *ngIf="societe.adresse.ville">{{ societe.adresse.ville }}</span>
                <span *ngIf="societe.region">, {{ societe.region }}</span>
                <span *ngIf="societe.adresse.nomPays">, {{ societe.adresse.nomPays }}</span>
              </div>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">SIRET</p>
              <p class="text-gray-900">{{ societe.siret }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="societe&&statusCode==201" class="bg-green-50 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-semibold text-green-900 mb-4">Votre inscription est confirmée !</h3>
          <p class="text-green-800">
            Un email contenant vos identifiants administrateur a été envoyé à :<br>
            <span class="font-semibold">{{ societe.email }}</span>
          </p>
          <p class="text-green-800 mt-2">
            Vous pouvez maintenant accéder à votre espace administrateur et commencer à utiliser la plateforme.
          </p>
        </div>
        <div *ngIf="societe&&statusCode==202" class="bg-green-50 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-semibold text-green-900 mb-4">Votre société a été créée !</h3>
          <p class="text-green-800">
            Votre compte existant (<span class="font-semibold">{{ societe.email }}</span>) est désormais rattaché à cette société.<br>
            Vous pouvez continuer à utiliser vos identifiants habituels pour accéder à l'espace administrateur.
          </p>
        </div>

        <div class="text-center">
          <a [routerLink]="['/auth/login']" class="btn-primary">
            Se connecter
          </a>
        </div>
      </div>
    </div>
  `
})
export class RegisterSuccessComponent implements OnInit {
  societe: SocieteBD | null = null;
  statusCode: number | null = null;


  constructor(private router: Router, private localStorage: LocalStorageService) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['societe']) {
      this.societe = navigation.extras.state['societe'];
      this.localStorage.set('register_societe', this.societe);
    } else {
      this.societe = this.localStorage.get<any>('register_societe');
    }
    // Si reload, récupérer la société et le status depuis le LocalStorageService
    const societeStr = this.localStorage.get<string>('register_societe');
    const statutCode = this.localStorage.get<string>('inf-statuscode');
    if (societeStr) {
      try {
        this.societe = typeof societeStr === 'string' ? JSON.parse(societeStr) : societeStr;
      } catch {
        this.societe = societeStr as any;
      }
      this.statusCode = statutCode ? Number(statutCode) : null;
    } else {
      // Redirection vers la page d'inscription si pas de données
      this.router.navigate(['/auth/register']);
    }
  }
}