import mongoose from 'mongoose';
import {model} from 'mongoose';
import { userSchema, sessionSchema , productSchema, notificationSchema,NotificationModel} from './schema';
import {TypeProduct,TypeNotification} from './types/api';
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
const notification : TypeNotification = {
  title: 'Thank you for Joining Belai-Express',
  body: 'A big welcome to Belai Express and micro trading services ',
  recipients: [],
  receivedBy: [],
  pictures: [],
  notificationId: crypto.randomBytes(64).toString('hex'),
  urls: ['belai-express.com/trading','https://wwe.zeiro.com/businesses'],
  createdAt: new Date(),
  sendAt: new Date();
  
}

import { main } from './client';

const bcrypt = require('bcryptjs');
const salt = '$2a$10$vISXPe5uiGy5KPg8EYLux.'
//mongoose.set('bufferCommands', false);
const User = mongoose.model('User',userSchema);
const Session = mongoose.model('Session',sessionSchema);
const Product = model<TypeProduct>('Product',productSchema);
const Notification = model<TypeNotification,NotificationModel>('Notification',notificationSchema)
console.log(Notification)
async function s(){
  main()
  .then(async (arr: any)=>{
    console.log('yes')
     // await mongoose.connect('mongodb+srv://martintembo1:$9th_April_2017&@cluster0.x6koa.mongodb.net/belaiexpress?retryWrites=true&w=majority',() => {
    //console.log('connected')
  //});
  let p = new Product(product);
  p.save().then(()=>{
    console.log('done')
  }).catch((err: Error)=>{
    console.log(err)
  });
  await p.save();
  console.log(p.name)
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
function setNotification(new_notification: TypeNotification) {
  return new Promise ((resolve, reject)=>{
  main()
  .then(async ()=>{
    let my_notification = new Notification(notification);
    await my_notification.save();
    let noti = await Notification.findOne({notificationId: my_notification.notificationId});
   if(noti !== null){
     resolve({status: true,notification:noti});
   } else {
     reject({status:false, message:'Something went wrong, try saving or resending the notification'});
   }
  })
  .catch((err: Error) =>{
    console.log(err);
    reject({status: false,msg:err.message, message: 'Wrong'});
  });
  });
}
type recipient = string | undefined;
function getNotifications(recipient: any) {
  return new Promise ((resolve, reject)=>{
  main()
  .then(async ()=>{
    let notifications = await Notification.find();
    if(recipient !== undefined) {
      
       resolve(notifications);
      if(notifications !== []){
     //resolve({status: true,notification:noti});
      } else {
     reject({status:false, message:'Something went wrong, try saving or resending the notification'});
   }
   } else {
      
    }
  })
  .catch((err: Error) =>{
    console.log(err);
    reject({status: false,msg:err.message, message: 'Wrong'});
  });
  });
}

/*
setNotification(notification)
.then ((notification:any) =>{
  console.log(notification)
})
.catch((err: Error)=>{
  console.log(err)
});
*/
const orm = {
  user: User,
  addUser : addUser,
  authUser: authUser,
  checkUser: checkUser,
  updateUser: updateUser,
  getUser: getUser,
  getProducts: getProducts,
  getProduct: getProduct,
  setNotification:setNotification,
  getNotifications:getNotifications
}
export default orm;