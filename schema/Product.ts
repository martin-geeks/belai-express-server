import {Schema} from 'mongoose';
import {TypeProduct} from '../types/api';
const crypto = require('crypto');
export const productSchema = new Schema<TypeProduct>({
  name: {type:String, required:true},
  amount:String,
  rating:{type: Number, required:false,default:0},
  photo: {type:String,required:true},
  category: {type: Object,required:true, default:{category:'Misc', subcategory:'Variety'}},
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
  addedDate: {type:Date,default:new Date}
})