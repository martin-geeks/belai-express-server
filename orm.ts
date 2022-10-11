import mongoose from 'mongoose';
import {model} from 'mongoose';
import { userSchema, sessionSchema , productSchema, notificationSchema,NotificationModel,CartModel,cartSchema, wishlistSchema, WishlistModel,CategoryArrangementModel,categoryArrangementSchema, reviewSchema,ReviewModel} from './schema';
import {TypeProduct,TypeNotification,TypeCart,TypeCategoryArrangement,TypeCategory, Review as TypeReview, Wishlist as TypeWishlist} from './types/api';
const crypto = require('crypto');
const dotenv =  require('dotenv');
dotenv.config();
//import crypto from 'crypto';
interface SessionType {
  action: string;
  userId: string;
}
const product: TypeProduct = {
  name: 'Iphone X Silver',
  amount: 'ZMW 3009.50',
  rating: 2,
  photos: ['/photos/clothing.jpg','/photos/clothing2.jpg'],
  model: 'x135',
  brand: 'Apple',
  manufacturer: 'Apple Inc.',
  variants: [{}],
  product_id: crypto.randomBytes(64).toString('hex'),
  description: 'Best Phone on the market',
  discount: 'K800',
  availability: true,
  delivery:true,
  specifications: [{'MODEL':'x15'},{'LAUNCH':'September 2021'},{'Waterproof':'YES'}],
  shipping: [{location:'Lusaka',time:'1hour',cost:0}],
  about: 'explicari nisl viderer ullamcorper hac ut purus aenean. libris aeque sumo autem usu pulvinar nascetur numquam nobis ludus noster nam postea sententiae. ',
  locations:['Lusaka','Luapula'],
  release: new Date(),
  expire: new Date(),
  addedDate: new Date(),
  updatedAt: new Date(),
  tags: ['phone','mobile','tech'],
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
  sendAt: new Date()
  
}
const myCart: TypeCart = {
  userId: 'jsjsispapsbsbsjs',
  products: [{count:15,productId:'jsksosbsbsisbsbbshs'}],
  addedDate: new Date(),
}
import { main } from './client';

const bcrypt = require('bcryptjs');
const salt = process.env.PASSWORD_SALT;
//mongoose.set('bufferCommands', false);
const User = mongoose.model('User',userSchema);
const Session = mongoose.model('Session',sessionSchema);
const Product = model<TypeProduct>('Product',productSchema);
const Notification = model<TypeNotification,NotificationModel>('Notification',notificationSchema)
const Cart = model<TypeCart,CartModel>('Cart',cartSchema)
const Wishlist = model<TypeWishlist,WishlistModel>('Wishlist', wishlistSchema)
const Review = model<TypeReview, ReviewModel>('Review',reviewSchema);
const categoryArrangement = model<TypeCategoryArrangement>('CategoryArrangement',categoryArrangementSchema);
//(Notification)
async function demoProduct(){
  main()
  .then(async (arr: any)=>{
    //('yes')
     // await mongoose.connect('mongodb+srv://martintembo1:$9th_April_2017&@cluster0.x6koa.mongodb.net/belaiexpress?retryWrites=true&w=majority',() => {
    ////('connected')
  //});
  let p = new Product(product);
  p.save().then(()=>{
    //('done')
  }).catch((err: Error)=>{
    //(err)
  });
  await p.save();
  //(p.name)
  })
  .catch((err:Error) =>{
    
  });
}
function addUser(userData:any){
    //console.log(userData)
  return new Promise((resolve,reject)=>{
    
  main()
  .then(async (client:any) => {
   
     userData.password = bcrypt.hashSync(userData.password, salt);
     if(userData.userId) {
         
     } else {
         userData.userId = crypto.randomBytes(64).toString('hex');
     }
       //console.log(userData)
       const user = new User(userData);
       await user.save();
       const  session = new Session({action:'Created an account',user:user.userId});
       await session.save();
      resolve({status: true,message:'Success',userData});
  })
  .catch ((err: Error) => {
    //(1111,err)
    reject({status:false, message:err.message});
  });
  });
}
function setupOnce() {
    checkUser({userId:'anonymous'})
    .then((state:any)=>{
         if(!state.status) {
             addUser({
  "username": "anonymous",
  "phone": "null",
  "email": "anonymous@belai-express.com",
  "location": "N/A",
  "photo": "/assets/images/anonymous.jpg",
  "userId": "anonymous",
  "password": "203019",
  "date": new Date(),
  "firstname": "Anonymous",
  "lastname": "User"
})
             .then((resp :any)=>{
                 //('Setup Complete')
             })
             .catch((err:Error)=>{
                 //('Could not setup')
                 //(err)
                 
             })
         } else {
             //('Setup Already')
         }
    })
    .catch((err: Error)=>{
        //('Something went wrong while setting up');
    });
}
setupOnce();
function checkUser(userData:any){
  return new Promise((resolve,reject) => {
    main()
    .then(async (client:any) => {
      //(userData)
      let user = await User.findOne(userData);
      //(user)
      if(user != null){
        resolve({status: true, message:'Email exists'});
      } else {
        resolve({status:false,message:'User exists not'});
      }
     
    })
    .catch((err: any)=>{
      //(err)
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
          ////('Access Granted');
        } else {
          await addSession({userId:user.userId, action:'Tried to login but password was incorrect'})
           return reject({status:false, message:'Wrong password', password:false, username:true});
          ////('wrong password')
        }
      } else {
        
        //('User not found');
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
          //('Access Granted');
        } else {
          await addSession({userId:user.userId, action:'Tried to login but password was incorrect'})
           return reject({status:false, message:'Wrong password',password:false, email:true});
          ////('wrong password')
        }
        //('user found')
      } else {
        return reject({status:false, message:'Email not found in our system'})
        ////('User not found')
      }
      return 'Email'
    }
  });
  
  
  })
  .catch((err:any)=>{
    //(err)
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
    //(err);
  });
});
}
async function setArrangement(editor:string,editorId:string,arrangement: TypeCategory[]) {
  return new Promise((resolve,reject)=>{
    main().then(()=>{
      let my_arrangement = new categoryArrangement({editor:editor, editorId:editorId,arrangement:arrangement,date: new Date()});
      my_arrangement.save();
      resolve({status: true,arrangement:my_arrangement});
    }).catch((err:Error)=>{
      reject({status:false, message:err.message});
    });
  });
}
//setArrangement('Martin Tembo','pwjshsu+@+$+#+8+h',['Clothing','Technology','Food','Misc']);
function getArrangement(){
  return new Promise((resolve,reject)=>{
    main().then(async ()=>{
      let arrangement = await categoryArrangement.find();
      resolve({status:true, arrangement:arrangement});
    }).catch((err:Error)=>{
      reject({status:false, message:err.message});
    });
  });
}
/*
//*******TEST FUNCTION FOR FETCHING Category Arrangement********
getArrangement()
.then((response:any)=>{
  //(Object.getOwnPropertyNames(response.arrangement));
  //(response.arrangement.reverse()[0]);
})
.catch((err: Error) =>{
  //(err)
});
*/
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
    //(err);
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
    //(err);
    reject({status: false,msg:err.message, message: 'Wrong'});
  });
  });
}
function setCart(cart: TypeCart){
  return new Promise((resolve,reject) =>{
    main()
    .then(async ()=>{
      
      
      const existingItems = await Cart.findOne({userId:cart.userId});
      
      //await crt.save();
      if(existingItems === null) {
        const crt = new Cart(cart);
        await crt.save();
        return 0;
      } else {
       let check2 = existingItems.products.filter((product)=> product.productId === cart.products[0].productId);
      //(check2)
     if(check2.length === 0) {
       existingItems.products.push(cart.products[0]);
       ////(existingItems)
       await existingItems.save();
       //(existingItems)
       let data = await getCart(cart.userId);
       //(data)
       resolve(data);
     } else {
       reject({status:false, message:'exists'})
     }
      
      }
    })
    .catch((err:Error)=>{
      reject({status:false,message:err.message});
    });
  });
}
function getCart(params:any){
  return new Promise((resolve,reject) =>{
    main()
    .then(async ()=>{
      const crt = await Cart.findOne({userId:params})
      if(crt){
        if(crt.products.length > 0){
          //Executed when the cart list of a specific user has been found with products;
          //(crt)
          var myCartList:any= [];
          var amount: number = 0;
          ////(crt.products)
          for(let i=0; i < crt.products.length; i++){
            ////(crt.products[0])
            let fetchedProduct = await getProduct(crt.products[i]['productId']);
            
            myCartList.push(fetchedProduct);
         
          }
          /*for(let i=0; i<crt.products.length;i++) {
            for(let k=0; i<myCartList.products.length;i++){
              if(crt.products[i]['productId']  === myCartList[i]['productId']) {
                myCartList[i]['count'] = crt.products[i]['count'];
              }
            }
          }*/
          for(let i=0; i<myCartList.length; i++){
             amount += parseFloat(myCartList[i]['amount'].split(' ')[1]);
             
          }
          //(myCartList[0])
          resolve({status:true,cart:crt.products,products:myCartList,amount: amount})
        } else {
          //Executed when the fetched product is no longer available
          reject({status:false,message:'There is nothing in the cart at the moment'});
        }
      } else {
        //Executed when the user is not found in the cart collection [table] in the database.
        //This may mean that the user has not added anything in the cart via rhe client side.
        reject({status:false, message:'Something went or you may not have added anything in the cart.'});
      }
    })
    .catch((err:Error)=>{
      //This part is executed when there is an error with the system in making requests to the database
      //See originalMessage for actual error other than the message property of the rejected object.
      reject({status:false,message:'Something went on the server or try again.', originalMessage:err.message});
    });
  });
}
interface DeleteCart {
    userId: string;
    productId: string;
}
function deleteCart(payload: DeleteCart) {
    
    return new Promise(async (resolve,reject)=>{
        await main()
        ////(payload)
        const cart = await Cart.findOne({userId:payload.userId});
        if(cart) {
            const products = cart.products.filter((product:any,index:number) => product.productId !== payload.productId );
            ////('New Array',products)
            const updatedCart = await Cart.updateOne({userId:payload.userId,products:products});
            if(updatedCart.acknowledged) {
                //('Cart Updated');
                addSession({action:`You removed a product of id ${payload.productId} from the cart list`,userId:payload.userId});
                resolve({status:true, message:'The cart was updated'});
            } else {
                addSession({action:`You attempted to remove a product of id ${payload.productId} from the cart list`,userId:payload.userId});
                reject({status:false,message:'Could not update'});
            }
            
        } else {
            ////(cart)
            addSession({action:`You attempted to remove a product of id ${payload.productId} from the cart list`,userId:payload.userId});
            reject({status:false,message:'You have no items in cart'});
        }
    });
}
interface WishlistPayload {
    userId: string;
    product: string;
    //wishlistId: string;
}
function setWishlist(payload: WishlistPayload) {
    return new Promise((resolve,reject) =>{
    main()
    .then(async ()=>{
        const checkWishlist = await Wishlist.findOne({userId:payload.userId});
        console.log(checkWishlist)
        if(!checkWishlist) {
            console.log('record not found')
            const wishlist = new Wishlist(payload);
            wishlist.products.push(payload.product);
            console.log(wishlist)
            await wishlist.save();
            addSession({action:`Added an item of id ${payload.product} to wishlist`,userId:payload.userId})
            resolve({status:true, message:' Successfully Added',newList:wishlist});
        } else {
            console.log('record found');
            let products = checkWishlist.products;
            let checkProduct = products.filter((product: string) => product === payload.product);
            if(checkProduct.length > 0){
                addSession({action:`Attempted an item of id ${payload.product} to wishlist`,userId:payload.userId})
                reject({status:false, message:'The product already in the wishlist'});
            } else {
                console.log('OK! ',products)
                products.push(payload.product);
                console.log(products)
                
                let updateWishlist = await Wishlist.updateOne({userId:payload.userId},{$set:{products:products}});
                addSession({action:`Added an item of id ${payload.product} to wishlist`,userId:payload.userId})
                resolve({status:true, message:'Successfully Updated',wishlist:updateWishlist})
            }
        }
    })
    .catch((err:Error)=>{
      reject({status:false,message:err.message});
    });
  });
}
function getWishlist(userId: string) {
    return new Promise((resolve,reject)=>{
        main()
        .then(async ()=>{
            const wishlist = await Wishlist.findOne({userId:userId});
            if(wishlist){
                const products:any = []
                wishlist.products.forEach(async (productId: string)=>{
                    const product = await getProduct(productId);
                    products.push(product);
                });
                
                setTimeout(function(){
                    addSession({action:`Fetched items from wishlist`,userId:userId})
                    resolve({status: true,count:products.length,products:products, message:'Success', wishlist: wishlist.products});
                },1000);
            } else {
                addSession({action:` fetched items from wishlist`,userId:userId})
                resolve({status:false,message:'Nothing found'})
            }
        })
        .catch((err:Error)=>{
            addSession({action:`Attempted to fetch items from wishlist`,userId:userId})
            reject({status:false,message:'Something went wrong'})
        });
    });
}
interface DeleteWishlist {
    userId:string;
    product:string;
}
function deleteWishlist(payload: DeleteWishlist) {
    return new Promise ((resolve,reject)=>{
        main()
        .then(async ()=>{
            const wishlist = await Wishlist.findOne({userId:payload.userId});
            if(wishlist) {
                const products = wishlist.products.filter((productId: string)=> productId !== payload.product);
                let updateWishlist = await Wishlist.updateOne({userId:payload.userId},{$set:{products:products}});
                resolve({status:true, message:'Success',update:updateWishlist})
            } else {
                reject({status:false, message:'Not Success'})
            }
        })
        .catch((err:Error)=>{
            reject({status:false,message:'Something went wrong',originalMessage:err.message});
        });
    });
}
function setReview(payload: any,file=null) {
    console.log(payload)
    return new Promise((resolve,reject)=>{
        main()
        .then(async ()=>{
            
            const review = new Review (payload);
            
            review.reviewId = crypto.randomBytes(64).toString('hex');
            await review.save();
            addSession({action:`Added a review of id ${review.reviewId}`,userId:payload.userId})
            resolve({status: true, message:'Review Added'});
        })
        .catch((err:Error)=>{
            //(err)
            addSession({action:'Attempted to add a review',userId:payload.userId})
            reject({status:false, message:'Operation not performed',originalMessage:err});
        });
    })
}
function getReview() {
    return new Promise((resolve,reject)=>{
        main()
        .then(async ()=>{
            const reviews = await Review.find();
            
            resolve(reviews);
        })
        .catch((err:Error)=>{
            //(err)
            reject({status:false, message:err.message});
        });
    });
}
interface GetReview {
    userId: string;
    productId: string;
}
function getReviewById(payload:any) {
    return new Promise((resolve, reject)=>{
        main()
        .then(async ()=>{
            var reviews = await Review.find(payload);
            const reviews_ = JSON.parse(JSON.stringify(reviews));
            const x:any= []
            console.log(reviews_)
            reviews_.forEach(async (review:any)=>{
                let user = await User.findOne({userId: review.userId});
                //@ts-ignore
                review.user = {fullname:`${user.firstname} ${user.lastname}`}
                x.push(review)
            });
            setTimeout(function(){
                resolve({status:true, message:'Success', reviews:x})
            },1000)
            
        })
        .catch((err:Error)=>{
            reject({status:false,message:'Something went wrong',originalMessage:err.message});
        });
    });
}
//getReview();
/*getReviewById({product:'024395bf3209ee5f36ddb609545cfd2f489c359c2001e75a6b263fbd1e2d47c27fe41e66efd0bf44be803504f3ae2f5cc0fb533b6c66ba104920251a510579vc'});*/

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
  getNotifications:getNotifications,
  getCart: getCart,
  setCart: setCart,
  setWishlist:setWishlist,
  getWishlist:getWishlist,
  setReview: setReview,
  getReview: getReview,
  deleteWishlist:deleteWishlist,
  getReviewById: getReviewById,
  deleteCart: deleteCart,
  getArrangement:getArrangement,
  setArrangement:setArrangement,
}
export default orm;