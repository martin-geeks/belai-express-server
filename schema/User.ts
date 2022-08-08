import { Schema } from 'mongoose';
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const salt ='$2a$10$vISXPe5uiGy5KPg8EYLux.';
export interface TypeUser {
  username: string;
  firstname: string;
  lastname: string;
  age: number;
  phone: string;
  email: string;
  location: string;
  active: boolean;
  password: string;
}
export const userSchema = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  age: Number,
  phone: {type: String, default:'null'},
  email: String,
  location:String,
  photo: {type: String, default:'/assets/images/default.jpg'},
  active: Boolean,
  userId: {type:String},
  password: String,
  date: {type: Date,default: Date.now}
},{
  methods: {
    fullname(){
      return `${this.firstname} ${this.lastname}`;
    }
  },
  statics: {
    findByUsername(username){
      return this.find({ username:username});
    },
    findByEmail(email){
      return this.find({email: email});
    },
    findByPhone(phone){
      return this.find({phone:phone});
    }
  },
  virtuals:{
    user : {
      
      get(){
        //@ts-ignore
        return Object.seal({username:this.username,firstname: this.firstname,lastname:this.lastname,email:this.email, location:this.location,password:this.password});
      },
      set(user: any){
        this.firstname = user.firstname;
        this.lastname = user.lastname;
        this.username = user.username;
        this.email = user.email;
        this.location = user.location;
        this.active = true;
        this.password = bcrypt.hashSync(user.password, salt);
        this.age = 0;
        this.userId = crypto.randomBytes(64).toString('hex');
        
      }
      
    }
  },
  query:{
    byFirstname(firstname){
      return this.where({ firstname: new RegExp(firstname, 'i') })
    }
  },
});