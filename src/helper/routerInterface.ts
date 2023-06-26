export interface user {
    _id: string,
    role:string,
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    address:string,
    phoneNumber:number
  }
export interface admin{
    role:string,
    route:string,
    addPermission:string
  }
export interface productData{
  _id:string,
  sellerId:string,
  productName:string,
  description:string,
  category:string,
  brand:string,
  price:number,
  stock:number
  }
export interface order{
    _id:string,
    buyerId:string,
    totalPrice:number
  }
export interface cart{
  _id:string,
  productId:string,
  buyerId:string,
  totalPrice:number,
  quantity:number
}