import {Express,Request,Response} from 'express';
import {TypeProduct} from './types/api';
import IPinfoWrapper,{IPinfo} from 'node-ipinfo';
const ipinfoWrapper = new IPinfoWrapper('08f46b695f4d5e');

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
const fs = require('fs');

dotenv.config();
const corsOptions  = {
  credentials: true
}
const app: Express = express();
app.use(cors(corsOptions));

app.use(session({secret:'test'}));
//app.use('/', express.static(path.join(__dirname, '../build')));
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());
app.use(cookieParser());
/*var salt = bcrypt.genSaltSync(10);
fs.writeFile('salt.json',JSON.stringify({salt:salt}),function(err :any) {
  
});*/
const port = process.env.PORT || 3001


//console.log(token)

const product: TypeProduct = {
  name: 'iPhone X Silver',
  amount: 'ZMW 999.50',
  rating: 3,
  photo: '',
  model: 'X series',
  brand: 'iPhone',
  manufacturer: 'Apple Company',
  variants: [{}],
  description: 'Data Typed',
  discount: 'K200',
  product_id: '763367',
  release: new Date(),
  expire: new Date(),
  addedDate: new Date(),
  tags: ['iphone','mobile'],
  category:{category:'Accessories', subcategory:'Mobile'}
}


app.get('*', function(req:Request, res:Response, next:any) {
  //console.log(req.path)
  return next();
});
app.post('*',function(req: Request,res: Response,next: any){
  //console.log(req.path);
  return next();
});
app.get('/',(req: Request,res: Response)=>{
	
	res.render('index.html')
});
app.get('/products',async (req: Request,res: Response)=>{
  let products : TypeProduct[] = new Array();
  for(let i=1; i<=10; i++){
    products.push(product);
  }
  orm.getProducts()
  .then( (products:any ) => {
    console.log(products)
  })
  .catch((err: Error) => {
    console.log('hhhhh',err,'hhhhiooop')
  });
  //console.log(products)
  res.json(products);
});
app.post('/products',async (req: Request,res:Response) =>{
  console.log('Requested')
  res.json({})
});
app.post('/create-account',async (req: Request,res: Response) => {
  console.log('request received');
  console.log(req.cookies)
  if (req.body.firstTime) {
  let OTP = Math.floor(100000 + Math.random() * 900000)
  await sendVerificationCode(req.body.data.email,OTP);
  res.cookie('belaiExpressVerify',{email:req.body.data.email,otp:OTP,step:1},{
    maxAge: 86400 * 1000,
    httpOnly: true,
    secure: false
  });
  res.json({status:true})
  } else {
    const user = req.body.data;
    console.log(user)
    var token = crypto.randomBytes(64).toString('hex');
    const userObject  = {
      fullname: `${user.firstname} ${user.lastname}`,
      username: user.username,
      location: user.location,
      email: user.username,
      password: user.password
    }
    var addr = req.socket.remoteAddress || '';
    try{
      let info = await ipinfoWrapper.lookupIp(addr.split(':')[1]);
      userObject.location = `${info.city}, ${info.country} [${info.countryCode}]`;
        //console.log(userObject);
        let status;
        console.log(status)
        if(status){
          let add = await orm.addUser(userObject);
            res.json({status: true,user:status})
        } else {
          
          res.json({status: false})
        }
    } catch(err : any) {
      console.log(err)
      userObject.location = 'N/A';
      res.json(err);
    }
    
    //res.json({})
  }
});
app.get('/create-account',async (req:Request,res:Response) =>{
  let prevStep = req.cookies['belaiExpressVerify'];
  if(prevStep){
    console.log(prevStep)
    res.json(prevStep);
  } else {
    res.json({email: null,step:0})
  }
  
});
app.post('/verify-account',async (req: Request,res: Response) => {
  const user= req.cookies['belaiExpressVerify'];
  console.log(req.cookies)
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
  console.log(req.body)
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
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
