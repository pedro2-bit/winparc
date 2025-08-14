export interface RoleInterface {
  id: number;
  code: string;
  libelle: string;
  privileges?: PrivilegeInterface[];
}
export interface RoleCreateIntergace {
  id:number
  code: string;
  libelle: string;
  privileges: PrivilegeInterface[];
}


export interface PrivilegeInterface {
  id: number;
  code: string;
  libelle: string;
  description: string;
}
export interface PrivilegesResponseInterface {
  totalItems: number;
  data: PrivilegeInterface[];
  totalPages: number;
  currentPage: number;
  status: number;
}


export interface RolesResponseInterface {
  totalItems: number;
  data: RoleInterface[];
  totalPages: number;
  currentPage: number;
  status: number;
}