export interface ForetInterfaceCreation {
  code: string;
  nom: string;
  typemesureId: number;
  departement: string;
}

export interface ForetInterface {
  id: number;
  code: string;
  nom: string;
  typemesure: TypeMesureInterface;
  departement: string;
  nbParcelles: number;
  surface:number;
}

export interface TypeMesureInterface {
  id: number;
  libelle: string;
  numero: number;
}

export interface ForetResponseInterface {
  totalItems: number;
  data: ForetInterface[];
  totalPages: number;
  currentPage: number;
  status: number;
}


