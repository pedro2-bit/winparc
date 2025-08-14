import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CompanyService, Company } from './company.service';
import { LocalStorageService } from './local-storage.service';
import { setUser, setSelectedSociete, setAuthorities } from '../../store/user.actions';
import { Utilisateur } from './user.service';

@Injectable({ providedIn: 'root' })
export class AppInitService {
  constructor(
    private companyService: CompanyService,
    private localStorage: LocalStorageService,
    private store: Store
  ) {}
  initialize(showLoaderCallback?: (show: boolean) => void) {
    // Active le global loader
    if (showLoaderCallback) showLoaderCallback(true);

    // Récupère l'utilisateur depuis les cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const userCookie = getCookie('user_state');
    let user: Utilisateur | null = null;
    let societes: any[] = [];
    if (userCookie) {
      try {
        user = JSON.parse(decodeURIComponent(userCookie));
        if (user && user.societes) {
          societes = user.societes;
        }
      } catch {}
    }

    // Récupère le token depuis les cookies et le sauvegarde dans le localStorage
    const token = getCookie('auth_token');
    if (token) {
      this.localStorage.set('auth_token', token);
    }

    if (user) {
      this.store.dispatch(setUser({ user }));
      // Récupère la société sélectionnée
      const selectedCompanyId = this.localStorage.get<number>('selectedCompanyId');
      let selectedSociete = undefined;
      if (Array.isArray(societes) && societes.length > 0) {
        selectedSociete = societes.find((s: any) => s.id === selectedCompanyId) || societes[0];
      }
      if (selectedSociete) {
        this.store.dispatch(setSelectedSociete({ societe: selectedSociete }));

        // Récupère les authorities via le backend
        const utilisateurId = user.id;
        const societeId = selectedSociete.id;
        const apiUrl = (typeof window !== 'undefined' && (window as any).environment?.apiUrl) || '';
        const url = `${apiUrl}/server/utilisateurs/details/${utilisateurId}/societe/${societeId}`;
        // Utilise fetch pour l'appel backend (remplacer par HttpClient si besoin)
        fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            let authorities: string[] = [];
            if (data && data.data && data.data.roles) {
              data.data.roles.forEach((role: any) => {
                if (role.privileges) {
                  role.privileges.forEach((priv: any) => {
                    if (priv.code && !authorities.includes(priv.code)) {
                      authorities.push(priv.code);
                    }
                  });
                }
              });
            }
            this.store.dispatch(setAuthorities({ authorities }));
          })
          .catch(() => {
            this.store.dispatch(setAuthorities({ authorities: [] }));
          })
          .finally(() => {
            if (showLoaderCallback) showLoaderCallback(false);
          });
        return;
      }
    }
    // Si pas d'utilisateur ou de société sélectionnée, désactive le loader
    if (showLoaderCallback) showLoaderCallback(false);
  }
}
