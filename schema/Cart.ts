import {Schema,Model} from 'mongoose';
import {TypeCart,CartMethods} from '../types/api';

export type CartModel = Model<TypeCart,{},CartMethods>;
const cartSchema = new Schema<TypeCart,{},CartMethods>({
  userId: {type: String, required:true},
  products: Array<Object>,
  addedDate: {type: Date,required:true, default:new Date}
});

cartSchema.method('addProduct', function add(cartItem:TypeCart){});
cartSchema.method('removeProduct', function remove(userId: string,productId:string){});
cartSchema.method('clearCart', function clear(userId: string){});
export default cartSchema;