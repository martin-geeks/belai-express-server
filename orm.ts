import mongoose from 'mongoose';
import {model} from 'mongoose';
import { userSchema, sessionSchema , productSchema} from './schema';
import {TypeProduct} from './types/api';
const crypto = require('crypto');
//import crypto from 'crypto';
interface SessionType {
  action: string;
  userId: string;
}
const product: TypeProduct = {
  name: 'iPhone X Silver',
  amount: 'ZMW 999.50',
  rating: 3,
  photo: 'hgggg',
  model: 'X series',
  brand: 'iPhone',
  manufacturer: 'Apple Company',
  variants: [{}],
  product_id: crypto.randomBytes(64).toString('hex'),
  description: 'Data Typed',
  discount: 'K200',
  release: new Date(),
  expire: new Date(),
  addedDate: new Date(),
  tags: ['iphone','mobile'],
  category:{category:'Accessories', subcategory:'Mobile'}
}


import { main } from './client';

const bcrypt = require('bcryptjs');
const salt = require('./salt.json');

const User = mongoose.model('User',userSchema);
const Session = mongoose.model('Session',sessionSchema);
const Product = model<TypeProduct>('Product',productSchema);
async function s(){
  main()
  .then(async (arr: any)=>{
  let p = new Product(product);
  console.log(p)
  console.log(p.name);
  console.log(await p.save());
  //console.log(p.name)
  })
  .catch((err:Error) =>{
    
  });
}
s();
async function addUser(userData:any){
  main()
  .then(async (client:any) => {
   
     userData.password = bcrypt.hashSync(userData.password, salt.salt);
     userData.userId = crypto.randomBytes(64).toString('hex');
       const user = new User(userData);
       await user.save();
       const  session = new Session({action:'Created an account',user:user.userId});
       await session.save();
      client.close();
  })
  .catch ((err: any) => {
    
  });
}
function checkUser(userData:any){
  return new Promise((resolve,reject) => {
    main()
    .then(async (client:any) => {
      let users = await User.find(userData);
      console.log(users)
      let user = await User.findByEmail('martintembo.zm@gmail.com');
      console.log(user)
    })
    .catch((err: any)=>{
      
    });
  });
}
//checkUser({username:'martintembo'});
async function authUser(userData: any){
  let keys = Object.keys(userData);
  return new Promise((resolve,reject)=>{
  main().
  then( (client:any) => {
  let f = keys.filter(async (data:string) => {
    if(data === 'username') {
      let user = await User.findOne({username:userData.username});
      if(user != null) {
        if(bcrypt.compareSync(userData.password,user.password)){
          await addSession({userId:user.userId, action:'Logged in'})
           return resolve({status:true,user});
          //console.log('Access Granted');
        } else {
          await addSession({userId:user.userId, action:'Tried to login but password was incorrect'})
           return reject({status:false, message:'Wrong password', password:false, username:true});
          //console.log('wrong password')
        }
      } else {
        
        console.log('User not found');
        return reject({status:false, message:'Username not found'});
      }
      //return 'Username'
    }
    if(data === 'email') {
      let user = await User.findOne({email:userData.email});
           if(user != null) {
             if(bcrypt.compareSync(userData.password,user.password)){
          await addSession({userId:user.userId, action:'Logged in'})
           return resolve({status:true,user});
          console.log('Access Granted');
        } else {
          await addSession({userId:user.userId, action:'Tried to login but password was incorrect'})
           return reject({status:false, message:'Wrong password',password:false, email:true});
          //console.log('wrong password')
        }
        console.log('user found')
      } else {
        return reject({status:false, message:'Email not found in our system'})
        //console.log('User not found')
      }
      return 'Email'
    }
  });
  
  
  })
  .catch((err:any)=>{
    console.log(err)
    reject({status:false, message:'Unknown error'});
  });
  });
  //let user = findByEmail()
}
const orm = {
  user: User,
  addUser : addUser,
  authUser: authUser,
  checkUser: checkUser,
  updateUser: updateUser,
  getProducts: getProducts
}
function updateUser(userId: string, data: any){
  
  return new Promise((resolve,reject)=>{
    main()
    .then( async () => {
      delete data.userId;
      
      await User.updateOne({userId:userId},data);
      await addSession({action:`Updated the following: ${Object.keys(data)}`,userId:userId});
     resolve({status: true,user:await User.findOne({userId:userId})});
    })
    .catch(async (err: Error)=>{
      await addSession({action:`Attempted to update the following: ${Object.keys(data)}`,userId:userId});
      reject({status: false, message:err.message});
    });
  });
}
async function addSession(session:any){
   const  sessions = new Session({action: session.action,user:session.userId});
       await sessions.save();
}
async function getProducts(){
  return new Promise((resolve, reject)=>{
    main()
    .then(async ()=>{
      let products = await Product.find({limit:20});
      
      resolve(products);
    })
    .catch( (err: Error)=>{
      reject(err);
    });
  });
}
export default orm;