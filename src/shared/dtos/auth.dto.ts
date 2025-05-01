export interface CustomerDTO {
    customerId?: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
  }

  export interface CustomerLoginDTO {
    email: string,
    password: string
  }

  export interface AdminLoginDTO {
    email: string,
    password: string
  }

  export interface WorkshopDTO {
    workshopId?: string,
    name: string,
    email: string,
    phoneNumber: string,
    country: string,
    state: string,
    city: string,
    streetAddress: string,
    buildingNo: string,
    password: string
  }

  export interface WorkshopLoginDTO {
    email: string,
    password: string
  }