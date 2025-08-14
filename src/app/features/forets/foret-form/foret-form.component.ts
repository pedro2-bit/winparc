import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForetInterface, ForetInterfaceCreation, TypeMesureInterface } from '../foret.interface';

export interface TypeGestion {
  id: number;
  code: string;
  libelle: string;
}

@Component({
  selector: 'app-foret-form',
  templateUrl: './foret-form.component.html',
  styleUrls: ['./foret-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class foretFormComponent implements OnInit {
  @Input() foret: ForetInterface | null = null;
  @Output() save = new EventEmitter<ForetInterface>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
  
  // Données de référence
 
  typesMesures: TypeMesureInterface[] = [{
    id: 1,
    libelle: 'Circonférence',
    numero: 2
  },
  {
    id: 2,
    libelle: 'Diametre',
    numero: 1
  },
  {
    id: 3,
    libelle: 'Hoppus',
    numero: 3
  }
];



  typeProduits: TypeGestion[] = [];

  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      numero: ['', Validators.required],
      designation: ['', Validators.required],
      libelleVente: ['', Validators.required],
      libelleAbrege: ['', Validators.required],
      sousFamilleId: ['', Validators.required],
      typeProduitId: ['', Validators.required],
      typeDocId: ['', Validators.required],
      presentationLigneId: ['', Validators.required],
      typeGestionId: ['', Validators.required],
      repartitionId: ['', Validators.required],
      codeTva: ['', Validators.required],
      tauxTva: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      prixNbrDecimal: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      gestionDonneesVente: [false],
      stocks: [false],
      rfa: [false]
    });
  }

  ngOnInit(): void {
    this.loadReferenceData();
    
    if (this.foret) {
      this.form.patchValue({
        code:this.foret.code,
        nom: this.foret.nom,
        typemesureid:this.foret.typemesure.id,
        departement:this.foret.departement,
     
      });
    }
  }

  loadReferenceData(): void {
    this.isLoading = true;
    
    // Charger les données de référence
    // this.referenceDataService.getSousFamilles().subscribe({
    //   next: (data) => {
    //     console.log('Sous-familles chargées:', data);
    //     this.sousFamilles = data.data as SousFamille[];
    //     if (this.sousFamilles && this.sousFamilles.length > 0) {
    //       this.form.patchValue({
    //         sousFamilleId: this.sousFamilles[0].id
    //       });
    //     }
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Erreur lors du chargement des sous-familles', error);
    //     this.isLoading = false;
    //   }
    // });
    
    // this.referenceDataService.getTypeProduits().subscribe({
    //   next: (data) => {
    //     this.typeProduits = data.typeProduits as TypeProduit[];
    //     if (this.typeProduits && this.typeProduits.length > 0) {
    //       this.form.patchValue({
    //         typeProduitId: this.typeProduits[0].id
    //       });
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Erreur lors du chargement des types de produits', error);
    //   }
    // });
    
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      
      const formValue = this.form.value;
      
      
      
      const foretData: ForetInterfaceCreation = {
        code: formValue.numero,
        nom: formValue.nom,
        typemesureId: formValue.typemesureId,
        departement: formValue.departement,       
      };
      
      this.save.emit(formValue);
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 