export interface ClientCreation {
  raisonSociale: string;
  typeSocieteId: number;
  numCompte: string;
  etatClientId: number;
  représentant: string;
  typeCompte: 'CHANTIER' | 'EN_COMPTE';
  isCompteSolde: boolean;
  societeId: number;
}

export interface TypeTelecomInterface {
  id: number;
  code: string;
  libelle: string;
}

export interface TelecomInterface {
  id?: number;
  typeTelecomId: number;
  typeTelecom?: TypeTelecomInterface;
  numero: string;
  prefix?: string;
}
export interface TypeSocieteInterface {
  id: number;
  code: string;
  libelle: string;
}

export interface EtatClientDtoInterface {
  id: number;
  code: string;
  libelle: string;
}

export interface DeviseInterface {
  id: string | number;
  dateCreation: number;
  lastDateUpdate: number;
  userCreation: string | null;
  lastUserUpdate: string | null;
  entityState: boolean;
  defaut: any;
  courtPeriode: any;
  intitule: string;
  code: string;
  codeIso: string | null;
  unite: any;
  sousUnite: any;
  source: any;
}

export interface SiteInterface {
  id: number;
  intitule: string;
  codeSite: string;
  telephone: string;
  telecopie: string;
  email: string;
  contact: string;
  piedDocument: string;
  societeId: number | null;
}

export interface EtatClientInterface {
  id: number;
  code: string;
  libelle: string;
}

export interface ClientInterface {
  id: number;
  raisonSociale: string;
  typeSocieteId: number;
  typeSociete: TypeSocieteInterface;
  typeCompte: string | null;
  numCompte: string;
  etatId: number;
  etatClientDto: EtatClientInterface | null;
  isCompteSolde: boolean;
  societeId: number;
  dateCreation: string | null;
  lastDateUpdate: string | null;
  userCreation: string | null;
  lastUserUpdate: string | null;
  entityState: any | null;
  telecoms?: TelecomInterface[];
  représentant?: string;
}




export interface ClientResponseInterface {
  totalItems: number;
  data: ClientInterface[];
  totalPages: number;
  currentPage: number;
  status: number;
}


