import {Schema} from 'mongoose';
const crypto = require('crypto');
export const sessionSchema = new Schema({
  action: String,
  user : String,
  sessionId : {type:String, default:crypto.randomBytes(64).toString('hex')},
  date: {type: Date, default:Date.now}
});