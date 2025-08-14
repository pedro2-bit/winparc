import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StaticDataService, TypeSociete, EtatClient } from '../../core/services/static-data.service';
import { Company } from '../../core/services/company.service';
import { Store, select } from '@ngrx/store';
import { selectSelectedSociete } from '../../store/user.selectors';
import { TelecomInterface, TypeTelecomInterface, SiteInterface } from './client.interface'
import { ClientService } from './clients.service';
import { SiteService } from '@core/services/site.service';

@Component({
  selector: 'app-client-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './client-add.component.html'
})
export class ClientAddComponent implements OnInit, OnDestroy {
  clientForm: FormGroup;
  typeSocietes: TypeSociete[] = [];
  sitesSociete: SiteInterface[] = [];
  etatClients: EtatClient[] = [];
  societes: Partial<Company>[] = [];
  selectedSociete: Partial<Company> | null = null;
  // telecoms: TelecomInterface[] = [];
  get telecomsFormArray(): FormArray<FormGroup> {
    return this.clientForm.get('telecoms') as FormArray<FormGroup>;
  }
  typeTelecoms: TypeTelecomInterface[] = [];
  isSubmitting = false;
  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private staticDataService: StaticDataService,
    private siteService: SiteService,
    private store: Store,
    private clientService: ClientService
  ) {
    this.clientForm = this.fb.group({
      raisonSociale: ['', Validators.required],
      codeAbrege: [''],
      siteId: ['', Validators.required],
      typeClient: ['', Validators.required],
      typeSocieteId: [null, Validators.required],
      numCompte: [null, Validators.required],
      email: [null, Validators.required],
      représentant: ['', Validators.required],
      typeCompte: ['CHANTIER', Validators.required],
      isCompteSolde: [false],
      societeId: [null, Validators.required],
      telecoms: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.staticDataService.getTypeSocietes().subscribe({
      next: (types) => this.typeSocietes = types,
      error: () => this.typeSocietes = []
    });

    this.staticDataService.getTypesPelecoms().subscribe({
      next: (types) => this.typeTelecoms = types,
      error: () => this.typeTelecoms = []
    });

    // Charge la société sélectionnée depuis le store et charge les sites associés
    this.store.pipe(select(selectSelectedSociete)).subscribe(societe => {
      if (societe) {
        this.societes = [societe];
        this.selectedSociete = societe;
        this.clientForm.patchValue({ societeId: societe.id });
        // Charger les sites de la société sélectionnée
        this.siteService.getSitesUnpaginatedBySocieteId(societe.id).subscribe({
          next: (res) => this.sitesSociete = res.data || [],
          error: () => this.sitesSociete = []
        });
      } else {
        this.selectedSociete = null;
        this.sitesSociete = [];
      }
    });
  }



  onSubmit() { 
    if (this.clientForm.valid) {
      this.isSubmitting = true;
      this.clientService.createClient(this.clientForm.value).subscribe({
        next: (res) => {
          this.resetTelecoms();
          this.isSubmitting = false;
          sessionStorage.setItem('clientNotification', JSON.stringify({
            message: 'Client créé avec succès',
            type: 'success'
          }));
          this.router.navigate(['/app/clients']);
        },
        error: (err) => {
          this.isSubmitting = false;
          sessionStorage.setItem('clientNotification', JSON.stringify({
            message: err?.error?.message || 'Erreur lors de la création du client.',
            type: 'error'
          }));
          //this.router.navigate(['/app/clients']);
        }
      });
    } else {
      this.clientForm.markAllAsTouched();
    }
  }


  onCancel() :void{
    this.resetTelecoms();
    this.router.navigate(['/app/clients']);
  }

  ngOnDestroy(): void {}

  //méthodes de gestion des télécoms
  getTelecomControl(i: number, controlName: string) {
    return (this.telecomsFormArray.at(i) as FormGroup).get(controlName);
  }

  addTelecom(): void {
    // Empêche l'ajout si le dernier télécom est incomplet
    if (this.telecomsFormArray.length > 0) {
      const last = this.telecomsFormArray.at(this.telecomsFormArray.length - 1);
      if (last.invalid) {
        last.markAllAsTouched();
        return;
      }
    }
    this.telecomsFormArray.push(this.fb.group({
      typeTelecomId: [null, Validators.required],
      numero: ['', [Validators.required, Validators.minLength(4)]],
    }));
  }


  removeTelecom(index: number): void {
    this.telecomsFormArray.removeAt(index);
    // Si plus aucun télécom, on vide le tableau dans le form principal
    if (this.telecomsFormArray.length === 0) {
      this.clientForm.patchValue({ telecoms: [] });
    }
  }


  resetTelecoms(): void {
    // Supprime tous les contrôles du FormArray
    while (this.telecomsFormArray.length > 0) {
      this.telecomsFormArray.removeAt(0);
    }
    // Met à jour le form principal pour refléter l'état vide
    this.clientForm.patchValue({ telecoms: [] });
  }

  onTelecomChange(index: number): void {
    // Optionnel : logique de validation ou de traitement en temps réel
  }
}
