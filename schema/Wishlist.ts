import {Schema,Model} from 'mongoose';
import {Wishlist} from '../types/api';
const crypto = require('crypto');
export type WishlistModel = Model<Wishlist,{}>

const wishlistSchema = new Schema<Wishlist,{}>({
    wishlistId: {type: String, required:true ,default:crypto.randomBytes(64).toString('hex')},
    userId: {type: String, required:true,},
    products: Array<String>,
    date: {type: Date, default: new Date}
});

export default wishlistSchema;