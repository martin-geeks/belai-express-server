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