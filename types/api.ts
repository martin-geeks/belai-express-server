export type TypeCategory = 'Accessories' | 'Clothing' | 'Food' | 'Misc'
export type TypeSubCategory = | 'Kids' | 'Adult' | 'Male' | 'Female'| 'Mobile' | 'Desktop' | 'Laptop' | 'Variety'
interface Category {
  category: TypeCategory;
  subcategory: TypeSubCategory;
}
export interface Shipping {
  cost: number;
  location: string;
  time: string;
}
export interface TypeProduct {
    name: string;
    amount: string;
    rating: number;
    category : Category;
    photos: Array<string>;
    model: string;
    brand: string;
    manufacturer: string;
    tags : string[];
    availability:boolean;
    delivery:boolean;
    locations:string[];
    product_id: string;
    variants: Array<Object>;
    description: string;
    shipping: Shipping[];
    specifications: object[];
    about: string;
    discount: string;
    release: Date;
    expire: Date;
    updatedAt: Date;
    addedDate: Date;
}
interface TypeTwoCategory {
  technology: TypeProduct[];
  clothing: TypeProduct[];
  food: TypeProduct[];
  misc: TypeProduct[];
}
interface TypeTwoSubCategory {
  adult: TypeProduct[];
  kids: TypeProduct[];
  male: TypeProduct[];
  female: TypeProduct[];
  mobile: TypeProduct[];
  laptop: TypeProduct[];
  variety: TypeProduct[];
}
export interface TypeFinalObject {
  category: TypeTwoCategory;
  sub: TypeTwoSubCategory;
}
export interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
}
export interface TypeNotification {
  title:string,
  body: string;
  pictures: string[];
  recipients: string[];
  receivedBy: string[];
  notificationId: string;
  urls: string[];
  createdAt: Date;
  sendAt: Date | undefined;
}
export interface Notification {
  title: string;
  body: string;
  pictures: string[];
  urls: string[];
  notificationId:string;
  createdAt: Date;
}
export interface NotificationMethods {
  notification(): Notification[];
}

interface CartProduct {
  count: number;
  productId: string;
}
export interface TypeCart {
  userId: string;
  products: CartProduct[];
  addedDate: Date;
}
export interface CartMethods {
  add(): ()=> boolean;
  remove(): ()=> boolean;
  clear(): ()=> boolean;
}

export interface TypeCategoryArrangement {
  editor: string;
  editorId: string;
  arrangement: TypeCategory[];
  date: Date;
}
export interface CategoryArrangementMethods {
  arrange(): ()=> boolean;
  rearrange(): ()=> boolean;
  resetArrangement(): ()=> boolean;
}