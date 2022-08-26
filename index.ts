import {Express,Request,Response} from 'express';
import * as apiManager from 'express';
import {TypeFinalObject,TypeProduct,TypeNotification,TypeCart} from './types/api';
import IPinfoWrapper,{IPinfo} from 'node-ipinfo';

const router = apiManager.Router();
const path = require('path');
import  orm from './orm';
import {sendVerificationCode} from './api';
const express = require('express');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv =  require('dotenv');
const bodyParser = require('body-parser');
const cors = require ('cors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

dotenv.config();
const corsOptions  = {
  credentials: true
}
const app: Express = express();
app.use(cors(corsOptions));
app.use(session({secret:'test'}));
app.use('/', express.static(path.join(__dirname,'build')));
app.use(express.static('build'));
app.set('view engine','ejs');
app.use('/api/v2',router);
const ipinfoWrapper = new IPinfoWrapper(process.env.IP_INFO_API_KEY || '');

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 3001

const generateAccessToken = (param:object) => {
    return jwt.sign(param, process.env.TOKEN_SECRET, { expiresIn: '1800s'});
}

app.get('*', function(req:Request, res:Response, next:any) {
  console.log(req.path)
  return next();
});
app.post('*',function(req: Request,res: Response,next: any){
  console.log(req.path);
  return next();
});
app.get('/',(req: Request,res: Response)=>{
	
	res.render('index');
});
app.get('/products',async (req: Request,res: Response)=>{
  orm.getProducts()
  .then( (products_arr: any) => {
    const fn = [];
    
    for(let i=0; i<products_arr.length;i++){
    
    }
    //console.log(products_arr,'hi')
    //console.log(fn)
    
    var finalObject: TypeFinalObject = {
      category: {
        technology:[],
        clothing:[],
        food:[],
        misc:[]
      },
     sub: {
       mobile:[],
       male:[],
       female:[],
       kids:[],
       variety:[],
       adult:[],
       laptop:[],
     }
    }
    products_arr.forEach((product:TypeProduct)=>{
      if(product.category.category === 'Accessories') {
        finalObject.category.technology.push(product);
      }
      if(product.category.category === 'Clothing') {
        finalObject.category.clothing.push(product);
      }
      if(product.category.subcategory === 'Mobile'){
        finalObject.sub.mobile.push(product);
      }
      if(product.category.subcategory === 'Male'){
        finalObject.sub.male.push(product);
      }
      
    });
    res.json(finalObject);
  })
  .catch((err: Error) => {
    console.log('hhhhh',err,'hhhhiooop')
    res.json({status:false,message:'Something went wrong'});
  });
  //console.log(products)
  //res.json(products);
});
app.get('/api/product',(req: Request,res: Response) => {
  console.log(req.query)
  //@ts-ignore
  let product_id = req.query.product_id.toString();
  
  orm.getProduct(product_id)
  .then((product: any) =>{
  //console.log(product);
  
  res.json({status:true,product: product});
  })
  .catch((err: Error)=>{
    res.json(err);
  });
});
app.post('/products',async (req: Request,res:Response) =>{
  console.log('Requested')
  res.json({})
});
app.post('/create-account',async (req: Request,res: Response) => {
  console.log('request received');
  

  if (req.body.firstTime) {
  let OTP = Math.floor(100000 + Math.random() * 900000);
  console.log("VERIFICATION CODE: ",OTP)
  const email = req.body.data;
  console.log(email)
   orm.checkUser({email:email.email})
  .then(async (data:any)=>{
      await sendVerificationCode(req.body.data.email,OTP);
      if(data.status !== true){
         res.cookie('belaiExpressVerify',{email:req.body.data.email,otp:OTP,step:1},{
    maxAge: 86400 * 1000,
    httpOnly: true,
    secure: false
  });
          res.json({status:true})
      } else {
        res.json({status:false,message:'Email exists. Try another one'});
      }
     
  })
  .catch((err: Error)=>{
    console.log(1)
    res.json(err);
  });
  } else {
    const user = req.body.fields;
    let p = req.cookies['belaiExpressVerify']
    var token = crypto.randomBytes(64).toString('hex');
    
    let userExistence:any = await orm.checkUser({username:user['username']});
    if(userExistence.status){
      //console.log(userExistence)
      res.json({status:false, message:'The username exists, try a another one'});
    } else {
      const userObject  = {
        fullname: `${user.firstname} ${user.lastname}`,
        firstname:user.firstname,
        lastname:user.lastname,
        username: user.username,
        location:'Lusaka, Zambia',
        email: user.username,
        password: user.password
      }
      var addr = req.socket.remoteAddress || '';
          try{
      let info = await ipinfoWrapper.lookupIp(addr.split(':')[1]);
      userObject.location = `${info.city}, ${info.country} [${info.countryCode}]`;
         userObject.email = p['email'];
         userObject.password = user['password'];
            let u = await orm.addUser(userObject);
            let user2 : any= await orm.getUser({username:userObject.username});
              let userData:any = {status:true,email:user2.email,username:user2.username,userId:user2.userId,photo:user2.photo,fullname:`${user2.firstname} ${user2.lastname}`, verified:true}
                res.cookie('belaiExpress',userData,{
    maxAge: 86400 * 1000,
    httpOnly: true,
    secure: false
    });
                res.json(userData);
          } catch(err : any) {
            
            userObject.location = 'N/A';
            userObject.email = p['email'];
            userObject.password = user['password'];
            orm.addUser(userObject)
            .then(async ()=>{
            const user2: any = await orm.getUser({username:userObject.username});
            
              let userData = {status:true,email:user2.email,username:user2.username,userId:user2.userId,photo:user2.photo,fullname:`${user2.firstname} ${user2.lastname}`, verified:true}
                res.cookie('belaiExpress',userData,{
    maxAge: 86400 * 1000,
    httpOnly: true,
    secure: false
    });
                res.json(userData);
              
            })
            . catch ((err: Error)=>{
              console.log(444,err)
              res.json(err)
            })
            /*
            let user2: any = await orm.getUser({username:userObject.username});
              let userData : any= {status:true,email:user2.email,username:user2.username,userId:user2.userId,photo:user2.photo,fullname:`${user2.firstname} ${user2.lastname}`, verified:true}
                res.cookie('belaiExpress',userData,{
    maxAge: 86400 * 1000,
    httpOnly: true,
    secure: false
    });
                res.json(userData);
          */
          }
    
    }
    
    

    //console.log(userObject)
    
    

    //res.json({})
    //res.json({status: true})
  }
});
app.get('/create-account',async (req:Request,res:Response) =>{
  let prevStep = req.cookies['belaiExpressVerify'];
  if(prevStep){
    console.log(prevStep);
    res.json(prevStep);
  } else {
    res.json({email: null,step:0})
  }
  
});
app.post('/verify-account',async (req: Request,res: Response) => {
  const user= req.cookies['belaiExpressVerify'];
  const receivedOTP = Number(req.body.data) 
  if(user.otp === receivedOTP) {
    res.cookie('belaiExpressVerify',{email:user.email,otp:user.otp,step:2, verified:true},{
    maxAge: 86400 * 1000,
    httpOnly: true,
    secure: false
    });
    
    res.json({status:true,step:2});
  } else {
    res.json({status: false,step:1});
  }
  
});
app.post('/login',async (req : Request,res: Response) =>{
  orm.authUser(req.body).
  then((userAuth: any) =>{
  //@ts-ignore
  if(userAuth.status){
    //@ts-ignore
    let user = userAuth.user;
    let userData = {status:true,email:user.email,username:user.username,userId:user.userId,photo:user.photo,fullname:`${user.firstname} ${user.lastname}`, verified:true}
    res.cookie('belaiExpress',userData,{
    maxAge: 86400 * 1000,
    httpOnly: true,
    secure: false
    });
    res.json(userData);
  }
  else {
    console.log(userAuth)
    res.json(userAuth)
  }
  })
  .catch((err: Error)=>{
    console.log(err)
    res.json(err);
  });
  //res.json({status:false});
});
app.post('/update',(req: Request,res: Response) => {
  console.log(req.body)
  
  if(req.body.userId === req.cookies['belaiExpress'].userId){
    orm.updateUser(req.cookies['belaiExpress'].userId,req.body)
    .then((updatedUser:any) => {
      if(updatedUser.status){
      let user = updatedUser.user;
       let userData = {status:true,email:user.email,username:user.username,userId:user.userId,photo:user.photo,fullname:`${user.firstname} ${user.lastname}`, verified:true}
    res.cookie('belaiExpress',userData,{
    maxAge: 86400 * 1000,
    httpOnly: true,
    secure: false
    });
    
      console.log(user,"gffddg");
      res.json(userData);
    } else {
      res.json({status:false, message:'Something went wrong, Try again later'});
    }
    })
    .catch((err: Error)=>{
      console.log(err,"yggfff");
        res.json({status: false,message:err.message});
    });
  }

});
app.post('/api/notifications',(req: Request,res: Response) =>{
  let notification = req.body.notification;
  orm.setNotification(notification)
  .then((send) =>{
    console.log()
    res.json(send);
  })
  .catch((err: Error) => res.json(err));
});
app.get('/api/notifications',(req: Request,res: Response) =>{
  let recipient = undefined;
  orm.getNotifications(recipient)
  .then((notifications: any) =>{
    res.json(notifications);
  })
  .catch((err: Error) => res.json(err));
});
app.get('/api/arrangement',(req: Request,res:Response) =>{orm.getArrangement().then((response:any)=> res.json(response)).catch((err: Error) => res.json(err));});
app.post('/api/v2/cart',(req:Request,res: Response)=>{
  if(req.cookies['belaiExpress']){
    const userId = req.cookies['belaiExpress']['userId'];
    if(req.body['userId'] === userId ) {
      const productId = req.body.productId;
      const count = req.body.count;
      orm.setCart({userId:userId,products:[{productId,count:count}],addedDate: new Date()})
      .then((response:any) =>{
        //console.log(status);
        res.json(response);
      })
      .catch((err:Error)=>{
        console.log(err)
        res.json({status:false,message:err.message});
      })
    } else {
      console.log(false)
    }
  }
  const myCart: TypeCart = {
  userId: 'jsjsispapsbsbsjs',
  products: [{count:15,productId:'jsksosbsbsisbsbbshs'}],
  addedDate: new Date(),
}
//res.json({})
});
app.get('/api/v2/cart',(req: Request,res: Response) =>{
  const token = generateAccessToken({test:true});
  if(req.headers.authorization == req.cookies['belaiExpress']['userId']) {
    orm.getCart(req.cookies['belaiExpress']['userId'])
    .then((cartList:any)=>{
      res.json(cartList)
    })
    .catch((err:Error)=>{
      res.json(err);
    });
  }
  /*orm.getCart({})
  .then((cartItems:any) => {
    //console.log(cartItems)
  })
  .catch((err: Error)=>{
    //console.log(err)
  });
  */
  //res.json(token);
});
app.get('/access-token',(req: Request,res: Response)=>{
 
  res.json({jwt:111})
});
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
