import {Schema,Model} from 'mongoose';
import {Review} from '../types/api';
const crypto = require('crypto');
export type ReviewModel = Model<Review,{}>;

const reviewSchema = new Schema<Review,{}>({
    reviewId: {type:String, required:true ,default:crypto.randomBytes(64).toString('hex')},
    userId: {type:String, required:true},
    product: {type: String,required: true},
    review: {type: String,required: true},
    rating: {type:Number,required:true},
    date: {type:Date, required:true, default:new Date}
})
export default reviewSchema; 