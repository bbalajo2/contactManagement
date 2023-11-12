export interface Errors {
    name?: string;
    email?: string;
    phoneNumber?: string;
  }
  
export  interface ActionData {
    errors?: Errors;
  }

 export interface contact {
    id: number;
    name: string;
    email: string;
    phoneNumber: number;
    address: string;
}

export interface LoaderParams {
    id: number;
}
