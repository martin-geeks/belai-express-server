import {Schema} from 'mongoose';
import {TypeProduct,Shipping} from '../types/api';
const crypto = require('crypto');
export const productSchema = new Schema<TypeProduct>({
  name: {type:String, required:true},
  amount:String,
  rating:{type: Number, required:false,default:0},
  photos: Array<string>,
  category: {type: Object,required:true, default:{category:'Misc', subcategory:'Variety'}},
  availability: {type: Boolean,required:true, default:false},
  delivery:{type: Boolean,required:true, default:false},
  locations:Array<string>,
  specifications: Array<object>,
  shipping:Array<Shipping>,
  about: {type: String,required:true},
  model: {type:String,required:true},
  brand: {type:String,required:true},
  manufacturer: {type: String,required:true},
  variants: Array<Object>,
  tags: Array<string>,
  product_id: {type: String, default:crypto.randomBytes(64).toString('hex')},
  description: {type:String,required:true},
  discount: {type:String,required:true},
  release: {type: Date,required:false},
  expire:{type: Date, required:false},
  updatedAt:{type: Date,required:false},
  addedDate: {type:Date,default:new Date}
})