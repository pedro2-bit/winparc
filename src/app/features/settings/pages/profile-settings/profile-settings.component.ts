import { AuthService } from '../../../auth/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '@features/settings/services/users.service';



export interface Societe {
  id: number;
  raisonSociale: string;
  codeSociete: string;
  adresse: {
    id: number;
    rue: string;
    codePostal: string;
    ville: string;
    nomPays: string;
  };
  telecoms: Array<{
    id: number;
    typeTelecomLibelle: string;
    prefix: string;
    numéro: string;
  }>;
  modulesLicences: Array<{
    id: number;
    code: string;
    libelle: string;
    logoUrl: string;
  }>;
  capital: string;
  siret: string;
  email: string;
  emailStatus: string | null;
}

// export interface UserProfile {
//   id: number;
//   name: string;
//   surname: string;
//   username: string;
//   gender: string;
//   email: string;
//   mobilePhone: string;
//   birthDate: number;
//   avatar: string | null;
//   enable: boolean;
//   societes: Societe[];
// }

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ProfileSettingsComponent implements OnInit {
  userProfile: any | null = null;
  isLoading = true;
  error: string | null = null;

  // Pour le modal mot de passe
  showPasswordModal = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
   this.loadUserProfile();
  }
  enrichUserModules(userData: any): any {
    return {
      ...userData,
      societes: userData.societes.map((societe: any) => ({
        ...societe,
        modules: societe.modules.map((mod: any) => {
          let url = '#';
          switch (mod.libelle) {
            case 'InfoNego':
              url = 'http://localhost:4202';
              break;
            case 'InfoSylve':
              url = 'http://localhost:4201';
              break;
            case 'WinCBI':
              url = 'http://localhost:4203';
              break;
            case 'WinCOUPE':
              url = 'http://localhost:4204';
              break;
          }

          return {
            ...mod,
            logoUrl: `/images/${mod.code.toLowerCase()}.png`,
            url
          };
        })
      }))
    };
  }

  loadUserProfile() {
    this.isLoading = true;
    this.error = null;
    //Remplace par l'appel réel à l'API utilisateur
    this.userService.getUserProfil().subscribe({
        next: (res: any) => {
          
          this.userProfile = this.enrichUserModules(res.utilisateur); 

          console.log('userProfile ',this.userProfile);
          
        //   if(this.userProfile.societes.length>0){
        //     for(let societe of this.userProfile.societes){
        //           societe = societe.modules.map((mod: any) => {
        //             let url = '#';
        //             switch (mod.libelle) {
        //               case 'InfoNego':
        //                 url = 'http://localhost:4202';
        //                 break;
        //               case 'InfoSylve':
        //                 url = 'http://localhost:4201';
        //                 break;
        //               case 'WinCBI':
        //                 url = 'http://localhost:4203';
        //                 break;
        //               case 'WinCOUPE':
        //                 url = 'http://localhost:4204';
        //                 break;
        //               default:
        //                 url = '#';
        //             }
        //             return {
        //               name: mod.libelle,
        //               logoUrl: `/images/${mod.code.toLowerCase()}.png`,
        //               url
        //             };
        // });
        //     }
        //   }
          
       console.log('user profile ',this.userProfile);
       
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    // Pour test, tu peux utiliser le JSON fourni :
    // this.userProfile = {
    //   id: 1,
    //   name: 'SUPER',
    //   surname: 'Admin',
    //   username: 'ias',
    //   gender: 'Male',
    //   email: 'sylvainonguene@gmail.com',
    //   mobilePhone: '+33676785300',
    //   birthDate: 1744381629143,
    //   avatar: null,
    //   enable: true,
    //   societes: [
    //     {
    //       id: 1,
    //       raisonSociale: 'IAS',
    //       codeSociete: 'IAS',
    //       adresse: {
    //         id: 1,
    //         rue: '103 AV DE LATTRE DE TASSIGNY',
    //         codePostal: '25510',
    //         ville: 'PIERREFONTAINE LES VARANS',
    //         nomPays: 'France'
    //       },
    //       telecoms: [
    //         {
    //           id: 1,
    //           typeTelecomLibelle: 'numéro principal',
    //           prefix: '+33',
    //           numéro: '60201202402',
    //         },
    //         {
    //           id: 1,
    //           typeTelecomLibelle: 'numéro secondaire',
    //           prefix: '+33',
    //           numéro: '62514521452',
    //         }
    //       ],
    //       modulesLicences: [
    //         {
    //           id: 1,
    //           code: 'WINGF',
    //           libelle: 'wingf',
    //           logoUrl: '/images/wingf.png',
    //         },
    //         {
    //           id: 1,
    //           code: 'WINCBI',
    //           libelle: 'wincbi',
    //           logoUrl: '/images/wincbi.png',
    //         }
    //       ],
    //       capital: '247 750 €',
    //       siret: '443731013',
    //       email: 'tagnemiguel@gmail.com',
    //       emailStatus: null
    //     }
    //   ]
    // };
    this.isLoading = false;
  }

  openPasswordModal() {
    this.showPasswordModal = true;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  submitPasswordChange() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    // Appel API pour changer le mot de passe ici
    this.userService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        // Affiche une notification personnalisée
        this.showPasswordModal = false;
        this.showSuccessNotification('Mot de passe modifié avec succès ! Vous allez être déconnecté dans 5 secondes...');
        setTimeout(() => {
          this.authService.logout();
        }, 5000);
      },
      error: (err) => {
        alert('Erreur lors de la modification du mot de passe.');
        console.error(err);
      }
    });
  }

  successNotification: string | null = null;
  showSuccessNotification(message: string) {
    this.successNotification = message;
    setTimeout(() => {
      this.successNotification = null;
    }, 5000);
  }
  

}


