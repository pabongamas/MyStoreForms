export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images:string[];
  category:{
    id:number,
    name:string
  };
}
