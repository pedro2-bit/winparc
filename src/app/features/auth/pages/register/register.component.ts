import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { RegisterService, Societe } from '../../services/register.service';
import { PaysService, Pays } from '../../services/pays.service';
import { HttpClientModule } from '@angular/common/http';
import { TypeTelecomInterface } from '@features/clients/client.interface';
import { StaticDataService } from '@core/services/static-data.service';
import { LocalStorageService } from '@core/services/local-storage.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  providers: [RegisterService, PaysService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  currentStep = 1;
  isLoading = false;
  errorMessage = '';
  commande:number=0;
  paysList: Pays[] = [];

  registerForm: FormGroup;
  get telecomsFormArray(): FormArray<FormGroup> {
    return this.registerForm.get('telecoms') as FormArray<FormGroup>;
  }
  typeTelecoms: TypeTelecomInterface[] = [];

  societe: Societe = {
    email: '',
    raisonSociale: '',
    manager: '',
    tel: '',
    codeSociete: '',
    adresse: '',
    region: '',
    pays: '',
    codePostal: '',
    ville: '',
    rue: '',
    capital: '',
    siret: '',
    naf: '',
    idIntraCom: '',
    numCtba: '',
    numPefc: '',
    numCe: '',
    telecoms: []
  };
  isLoadingGlobal = false;

  

  constructor(
    private router: Router,
    private registerService: RegisterService,
    private paysService: PaysService,
    private staticDataService: StaticDataService,
    private fb: FormBuilder,
    private localStorage: LocalStorageService
  ) {
    this.registerForm = this.fb.group({
      raisonSociale: ['', Validators.required],
      adresse: ['', Validators.required],
      codeSociete: ['', Validators.required],
      manager: ['', Validators.required],
      email: ['', Validators.required],
      tel: ['', Validators.required],
      pays: ['', Validators.required],
      ville: ['', Validators.required],
      region: ['', Validators.required],
      rue: ['', Validators.required],
      codePostal: [''],
      capital: ['', Validators.required],
      siret: [''],
      naf: [''],
      idIntraCom: [''],
      numPefc: [''],
      numCe: ['', Validators.required],
      numCtba: [''],
      telecoms: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadInitialData();
  }
  // Format le champ capital en live pour affichage avec séparateur
  formatCapital(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value) {
      // Format avec séparateur de milliers
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    this.registerForm.get('capital')?.setValue(value);
  }
  loadInitialData() {
    this.isLoadingGlobal = true;
    this.paysService.getPays().subscribe({
      next: (pays) => {
        this.paysList = pays;
      },
      error: (error) => {
        this.isLoadingGlobal = false;
        console.error('Erreur lors du chargement des pays:', error);
        this.commande=2
        this.errorMessage = 'Impossible de charger la liste des pays. Veuillez réessayer.';
      }
    });
    this.paysService.getTypesPelecoms().subscribe({
      next: (typeTelecoms) => {
        this.typeTelecoms = typeTelecoms;
        console.log('Types de télécoms:', typeTelecoms);
        
        this.isLoadingGlobal = false;
      },
      error: (error) => {
        this.isLoadingGlobal = false;
        console.error('Erreur lors du chargement des pays:', error);
        this.commande=2
        this.errorMessage = 'Impossible de charger la liste des pays. Veuillez réessayer.';
      }
    });
  
  }
   


  showErrors = false;
  nextStep() {
    // Contrôle des champs obligatoires à chaque étape via Reactive Form
    this.showErrors = false;
    let requiredFields: string[] = [];
    if (this.currentStep === 1) {
      requiredFields = ['raisonSociale', 'adresse', 'codeSociete', 'manager'];
    } else if (this.currentStep === 2) {
      requiredFields = ['ville', 'region', 'rue', 'capital'];
    } else if (this.currentStep === 3) {
      //requiredFields = ['numCtba', 'numCe'];
    }
    const missingFields = requiredFields.filter(f => {
      const control = this.registerForm.get(f);
      return !control || control.invalid || !control.value;
    });
    if (missingFields.length > 0) {
      this.showErrors = true;
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      missingFields.forEach(field => {
        const control = this.registerForm.get(field);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    // Vérification des champs obligatoires avant soumission via Reactive Form
    this.showErrors = false;
    const requiredFields = [
      'raisonSociale', 'adresse', 'codeSociete', 'manager', 'pays', 'ville', 'region', 'rue', 'capital', 'numCe'
    ];
    const missing = requiredFields.filter(f => {
      const control = this.registerForm.get(f);
      return !control || control.invalid || !control.value;
    });
    if (missing.length > 0) {
      this.showErrors = true;
      this.commande = 1;
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      missing.forEach(field => {
        const control = this.registerForm.get(field);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    console.log('données envoyées ',this.registerForm.value)
    // Met à jour l'objet societe avec les valeurs du formulaire
    // this.societe = { ...this.societe, ...this.registerForm.value, telecoms: this.telecomsFormArray.value };
    this.registerService.registerSociete(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Réponse API:', response.societe);
        this.localStorage.set('register_societe', response.societe);
        this.localStorage.set('inf-statuscode', response.status);
        this.router.navigate(['/register-success'], {
          state: { societe: response.societe }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.commande = 2;
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la création de la société. Veuillez réessayer.';
        console.error('Erreur API:', error);
      }
    });
  }

  
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
        this.registerForm.patchValue({ telecoms: [] });
      }
    }
  
  
    resetTelecoms(): void {
      // Supprime tous les contrôles du FormArray
      while (this.telecomsFormArray.length > 0) {
        this.telecomsFormArray.removeAt(0);
      }
      this.registerForm.patchValue({ telecoms: [] });
    }
}