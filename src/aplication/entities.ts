export interface Company {
    comp_id?: number;
    name: string;
    user_id: number;
    street: string;
    zip_code: string;
    city: string;
    phone_number: string;
    email?: string;
    date_created?: Date;
    date_updated: Date | null;
    date_deleted?: Date | null;
    is_deleted?: boolean;
    //physiotherapists?: Physiotherapist[];
  }
  
  export interface Physiotherapist {
    physio_id?: number;
    name: string;
    user_id: number;
    company_id: number;
    phone: string;
    email: string;
    date_created?: Date;
    date_updated: Date | null;
    date_deleted?: Date | null;
    is_deleted?: boolean;
    company?: Company;
    patients?: Pacient[];
  }
  
  export interface Pacient {
    id_pacient?: number;
    user_id: number;
    name: string;
    nif: number;
    email: string;
    age: number;
    id_physio: number;
    phone_numb: number;
    date_created?: Date;
    date_updated: Date | null;
    date_deleted?: Date | null;
    is_deleted?: boolean;
    physiotherapist?: Physiotherapist;
  }