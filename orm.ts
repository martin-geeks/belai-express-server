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
  photos: ['/photos/one.jpg','/photos/two.jpg'],
  model: 'X series',
  brand: 'iPhone',
  manufacturer: 'Apple Company',
  variants: [{}],
  product_id: crypto.randomBytes(64).toString('hex'),
  description: 'Data Typed',
  discount: 'K200',
  availability: true,
  delivery:true,
  specifications: [{'NETWORK':'GSM/HSPA'},{'LAUNCH':'September 2017'},{'DISPLAY':'TYPE=[Super Retina OLED, HDR10, Dolby Vision, 625 nits (HBM)]\nSIZE=(5.8 inches, 84.4 cm2 ~82.9% screen-to-body ratio),\n RESOLUTION=[1125 x 2436 pixels, 19.5:9 ratio (~458 ppi density)] \b \n PROTECTION=[Scratch-resistant glass, oleophobic coating ,Wide color gamut,3D Touch,True-tone]'},{'PLATFORM':'OS=[iOS 11.1.1, up to iOS 15.5, planned upgrade to iOS 16],CHIPSET=[Apple A11 Bionic (10 nm)] CPU=[Hexa-core 2.39 GHz (2x Monsoon + 4x Mistral)] GPU=[Apple GPU (three-core graphics)] '}],
  shipping: [{location:'Lusaka',time:'1hour',cost:0}],
  about: 'explicari nisl viderer ullamcorper hac ut purus aenean. libris aeque sumo autem usu pulvinar nascetur numquam nobis ludus noster nam postea sententiae. ',
  locations:['Lusaka','Southern Province'],
  release: new Date(),
  expire: new Date(),
  addedDate: new Date(),
  updatedAt: new Date(),
  tags: ['iphone','mobile'],
  category:{category:'Accessories', subcategory:'Mobile'}
}


import { main } from './client';

const bcrypt = require('bcryptjs');
const salt = '$2a$10$vISXPe5uiGy5KPg8EYLux.'

const User = mongoose.model('User',userSchema);
const Session = mongoose.model('Session',sessionSchema);
const Product = model<TypeProduct>('Product',productSchema);
async function s(){
  main()
  .then(async (arr: any)=>{
  let p = new Product(product);
  await p.save();
  //console.log(p.name)
  })
  .catch((err:Error) =>{
    
  });
}

function addUser(userData:any){
  return new Promise((resolve,reject)=>{
    
  main()
  .then(async (client:any) => {
   
     userData.password = bcrypt.hashSync(userData.password, salt);
     userData.userId = crypto.randomBytes(64).toString('hex');
       const user = new User(userData);
       await user.save();
       const  session = new Session({action:'Created an account',user:user.userId});
       await session.save();
      
  })
  .catch ((err: Error) => {
    console.log(1111,err)
    reject({status:false, message:err.message});
  });
  });
}
function checkUser(userData:any){
  return new Promise((resolve,reject) => {
    main()
    .then(async (client:any) => {
      console.log(userData)
      let user = await User.findOne(userData);
      console.log(user)
      if(user != null){
        resolve({status: true, message:'Email exists'});
      } else {
        resolve({status:false,message:'User exists not'});
      }
     
    })
    .catch((err: any)=>{
      console.log(err)
      reject({status: false, message:'Connection error'});
    });
  });
}
function getUser(data:any){
  return new Promise((resolve,reject)=>{
    main()
    .then(async () =>{
      let user = await User.findOne(data);
      if(user !== null){
        resolve({status:true,user:user});
      } else {
        reject({status:false, message:'User not found'});
      }
    })
    .catch((err: Error)=>{
      reject({status:false, message:err.message});
    });
  });
}
//getUser({username:'rose-mary'});
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
async function getProduct(product_id:string){
  return new Promise((resolve,reject)=>{
  main()
  .then(async ()=>{
    let product = await Product.findOne({product_id:product_id});
     if(product){
        resolve(product);
     }else{
       reject({status:false, message:'The item you are looking for is not available anymore'});
     }
  })
  .catch((err: Error)=>{
    console.log(err);
  });
});
}

const orm = {
  user: User,
  addUser : addUser,
  authUser: authUser,
  checkUser: checkUser,
  updateUser: updateUser,
  getUser: getUser,
  getProducts: getProducts,
  getProduct: getProduct,
}
export default orm;