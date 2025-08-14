export interface ParcelleInterfaceCreation {
  nom: string;
  surface: number;
  foret: ForetInterface;
}

export interface ParcelleInterface {
  id: number;
  nom: string;
  surface: number;
  foret: ForetInterface;
}

export interface ForetInterface {
  id: number;
  code: string;
  libelle: string;
}

export interface ParcelleResponseInterface {
  totalItems: number;
  data: ParcelleInterface[];
  totalPages: number;
  currentPage: number;
  status: number;
}


