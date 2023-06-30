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
export interface carts{
  buyerId:string
}
export interface Details{
  cartId:string,
  productId:string,
  totalPrice:number,
  quantity:number,
  price:number | undefined
}
export interface deleteUser{
  _id:string
}
export interface updateUser{
  _id:string
}
export interface searchTerm{
  searchTerm:string 
}

export interface updateCart{
  cartId:String,
  productId:String
  // totalPrice:number,
  // quantity:number,
  // price:number | undefined
}

export interface updatecart{
  cartId:string,
  productId:string
  totalPrice:number,
  quantity:number,
  price:number | undefined
}
export interface updatecartId{
  _id:String
}
export interface cartTotalPrice{
  totalPrice:number | undefined
}

export interface userLists{
 _id:string ,
  role:string ,
  firstName: string,
  lastName:string,
  email:string,
  password: string,
  address: string,
  phoneNumber: number,
  deletedAt: null | Date,
  isDeleted: false | true,
  createdAt: Date,
  updatedAt: Date
}