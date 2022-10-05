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
  credentials: true,
}
const app: Express = express();
app.use(cors(corsOptions));
app.use(session({secret:'test'}));
app.use('/', express.static(path.join(__dirname,'build')));
app.use(express.static('build'));
app.use(express.static('assets'));
app.set('view engine','ejs');
app.use('/api/v1',router);
const ipinfoWrapper = new IPinfoWrapper(process.env.IP_INFO_API_KEY || '');

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 3001

const generateAccessToken = (param:object,expire: string) => {
    return jwt.sign(param, process.env.TOKEN_SECRET, { expiresIn: expire});
}
function authenticateToken(req:Request,res:Response,next:any){
    
    //@ts-ignore
    const token = req.headers['authorization'].split(' ')[1]
    ////(verifyAccessToken(token))
    if(token === null) return res.status(401);
    jwt.verify(token, process.env.TOKEN_SECRET,(err: any, user: any) => {
    //(err,user)

    if (err) return res.status(403).json({originalMessage:err.message, message:'Token Error'});
    //@ts-ignore
    req.userId = user.userId;
    ////(req.cookies)
   //const savedToken = req.cookies[] 
    return next()
   /*if((username === user['username']) && (password === user['password'])) {
       //('DONE AUTHENTICATION')
       return next()
   } else {
       return res.status(401).json({status:false, message:'AUTHENTICATION FAILED'})
   }
    */
  })
    
}
app.get('*', function(req:Request, res:Response, next:any) {
  console.log(req.method,':',req.path)
  return next();
});
app.post('*',function(req: Request,res: Response,next: any){
    ////(req)
  console.log(req.method,':',req.path);
  return next();
});
app.get('/',(req: Request,res: Response)=>{
	
	res.render('index');
});
router.get('/products',async (req: Request,res: Response)=>{
  orm.getProducts()
  .then( (products_arr: any) => {
    const fn = [];
    
    for(let i=0; i<products_arr.length;i++){
    
    }
    ////(products_arr,'hi')
    ////(fn)
    
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
    //('hhhhh',err,'hhhhiooop')
    res.json({status:false,message:'Something went wrong'});
  });
  ////(products)
  //res.json(products);
});
app.get('/products/specific',async (req: Request,res: Response)=>{
  
  const client_products = req.query['products'];
  let products = [];
  let amount = 0;
  if(req.cookies['belaiExpress']){
  let cartList = await orm.getCart(req.cookies['belaiExpress']['userId']);
  //(cartList)
  //@ts-ignore
  for(let i=0; i<client_products.length;i++){
    //@ts-ignore
    products.push(await(orm.getProduct(client_products[i].toString())));
  }
  for(let i=0; i<products.length;i++) {
    //@ts-ignore
    amount += parseFloat(products[i]['amount'].split(' ')[1])
  }
  ////(amount)
  //orm.getProduct()
  if(products.length > 0){
    res.json({status:true,products:products,amount: amount,count:products.length});
  } else {
    res.json({status:false, message:'The products you added may not be available anymore.'});
  }
} else {
  let products = []
  //@ts-ignore
  for(let i=0; i<client_products.length;i++){
    //@ts-ignore
    products.push(await(orm.getProduct(client_products[i].toString())));
  }
  if(products.length > 0){
    res.json({status:true,products:products,count:products.length})
  } else{
  res.json({status:false, message:'The products you added may not be available anymore.'});
  }
}
});
app.get('/api/product',(req: Request,res: Response) => {
  //(req.query)
  //@ts-ignore
  let product_id = req.query.product_id.toString();
  
  orm.getProduct(product_id)
  .then((product: any) =>{
  ////(product);
  
  res.json({status:true,product: product});
  })
  .catch((err: Error)=>{
    res.json(err);
  });
});
app.post('/products',async (req: Request,res:Response) =>{
  //('Requested')
  res.json({})
});
app.post('/create-account',async (req: Request,res: Response) => {
  //('request received');
  

  if (req.body.firstTime) {
  let OTP = Math.floor(100000 + Math.random() * 900000);
  //("VERIFICATION CODE: ",OTP)
  const email = req.body.data;
  //(email)
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
    //(1)
    res.json(err);
  });
  } else {
    const user = req.body.fields;
    let p = req.cookies['belaiExpressVerify']
    var token = crypto.randomBytes(64).toString('hex');
    
    let userExistence:any = await orm.checkUser({username:user['username']});
    if(userExistence.status){
      ////(userExistence)
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
              //(444,err)
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
    
    

    ////(userObject)
    
    

    //res.json({})
    //res.json({status: true})
  }
});
app.get('/create-account',async (req:Request,res:Response) =>{
  let prevStep = req.cookies['belaiExpressVerify'];
  if(prevStep){
    //(prevStep);
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
    
    //(req.body)
    
    
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
    const responseData = {username:userData.username,fullname:userData.fullname,email:userData.email,photo:userData.photo,token:generateAccessToken({userId:userData.userId},'1d')}
    res.status(200).json(responseData);
  }
  else {
    //(userAuth)
    res.status(404).json(userAuth)
  }
  })
  .catch((err: Error)=>{
    //(err)
    res.status(401).json(err);
  });
  
  //res.json({status:false});
  
});
app.post('/update',(req: Request,res: Response) => {
  //(req.body)
  
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
    
      //(user,"gffddg");
      res.json(userData);
    } else {
      res.json({status:false, message:'Something went wrong, Try again later'});
    }
    })
    .catch((err: Error)=>{
      //(err,"yggfff");
        res.json({status: false,message:err.message});
    });
  }

});
app.post('/api/notifications',(req: Request,res: Response) =>{
  let notification = req.body.notification;
  orm.setNotification(notification)
  .then((send) =>{
    //()
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
app.get('/arrangement',(req: Request,res:Response) =>{orm.getArrangement().then((response:any)=> res.json(response)).catch((err: Error) => res.json(err));});
app.post('/cart',authenticateToken,(req:Request,res: Response)=>{
    //@ts-ignore
    //({userId:req.userId, product:req.body,count:req.body.count})
    //(req.cookies)
    //const userId = req.cookies['belaiExpress']['userId'];
    //@ts-ignore
    if(req.userId) {
      const productId = req.body.productId;
      const count = req.body.count;
      //@ts-ignore
      orm.setCart({userId:req.userId,products:[{productId,count:count}],addedDate: new Date()})
      .then((response:any) =>{
        //('success');
        res.json(response);
      })
      .catch((err:Error)=>{
        //(err)
        res.json({status:false,message:err.message});
      })
    } else {
      //('Something Went Wrong');
      res.status(401).send('An error Occurred');
    }
  

});
app.get('/cart',authenticateToken,(req: Request,res: Response) =>{
  const token = generateAccessToken({test:true},'10s');
  //@ts-ignore
  if(req.userId) {
      //@ts-ignore
    orm.getCart(req.userId)
    .then((cartList:any)=>{
       
      res.json(cartList)
    })
    .catch((err:Error)=>{
      //(err)
      res.json(err);
    });
  }
});
app.delete('/cart',authenticateToken,(req: Request,res: Response)=>{
    //(req.body.productId)
    ////(req.userId)
  //('success')
  //@ts-ignore
  orm.deleteCart({userId:req.userId,productId:req.body.productId})
  .then((data:any)=>{
      res.json(data)
  })
  .catch((err:Error)=>{
      res.status(404).json(err);
  })
  
});
app.post('/wishlist',authenticateToken,(req: Request,res: Response)=>{
    //@ts-ignore
    orm.setWishlist({userId:req.userId,product:req.body.productId})
    .then((responseData:any)=>{
        console.log(res)
        res.json(responseData)
    })
    .catch((err:Error)=>{
        console.log(err)
        res.status(444).json(err);
    })
});
app.get('/wishlist',authenticateToken,(req: Request,res: Response)=>{
    //@ts-ignore
    orm.getWishlist(req.userId)
    .then((responseData:any)=>{
        
        res.json(responseData)
    })
    .catch((err:Error)=>{
        res.status(404).send();
    })
});
app.delete('/wishlist',authenticateToken,(req: Request,res: Response)=>{
    //console.log(req.userId,)
    //@ts-ignore
    orm.setWishlist({userId:req.userId,product:req.param.productId})
    .then((responseData:any)=>{
        
        res.json(responseData)
    })
    .catch((err:Error)=>{
        
        res.status(404).send();
    })
});

app.post('/reviews',authenticateToken,(req: Request,res: Response)=>{
    //(req.body)
    //@ts-ignore
    orm.setReview({userId:req.userId,product:req.body.product,review:req.body.review,rating:req.body.rating,date: new Date()})
    .then((response:any)=>{
        res.json(response);
    })
    .catch((err:Error)=>{
        res.status(404).send();
    });
});
app.post('/reviews/anonymous',(req: Request,res: Response)=>{
    //(req.body)
    //@ts-ignore
    orm.setReview({userId:'anonymous',product:req.body.product,review:req.body.review,rating:req.body.rating,date: new Date()})
    .then((response:any)=>{
        res.json(response);
    })
    .catch((err:Error)=>{
        res.status(404).send();
    });
});
app.get('/reviews',(req: Request,res: Response)=>{
    //@ts-ignore
    orm.getReview()
    .then((response:any)=>{
        res.json(response);
    })
    .catch((err:Error)=>{
        res.status(404).send();
    });
});
app.get('/reviews-by-id',(req: Request,res: Response)=>{
    orm.getReviewById(req.query)
    .then((response:any)=>{
        //(response)
        res.json(response);
    })
    .catch((err:Error)=>{
        res.status(404).send();
    });
});
app.delete('/reviews',authenticateToken,(req: Request,res: Response)=>{
    //(req.body)
    //@ts-ignore
    orm.setReview({userId:req.userId,product:req.body.product,review:req.body.review,rating:req.body.rating,date: new Date()})
    .then((response:any)=>{
        res.json(response);
    })
    .catch((err:Error)=>{
        res.status(404).send();
    });
});

app.get('/access-token',(req: Request,res: Response)=>{
 
  res.json({jwt:111})
});
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
