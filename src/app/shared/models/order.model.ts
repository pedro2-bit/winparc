export interface Order {
  id: string;
  client: string;
  date: string;
  status: 'ARRIVEE_COMMAND' | 'SELECTION_PRODUIT' | 'TRAITEMENT_PRODCTION' | 'STOCKAGE' | 'EVACCUATION';
} 