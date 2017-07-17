export class User {
  id: number;
  password:string;
  last_login:any;
  is_superuser:boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff:boolean;
  is_active:boolean;
  date_joined:string;
  phone: string;
  birth_date:string;
  groups:any[];
  user_permissions:any[];
}
// fullNameCN(): string{
//   return this.last_name + this.first_name
// }
