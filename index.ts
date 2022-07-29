import {Express,Request,Response} from 'express';
import 'reflect-metadata';
import IPinfoWrapper,{IPinfo} from 'node-ipinfo';
const ipinfoWrapper = new IPinfoWrapper('08f46b695f4d5e');


import  orm from './orm';
import { TypeUser } from './entities';
import {sendVerificationCode} from './api';
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv =  require('dotenv');
const bodyParser = require('body-parser');
const cors = require ('cors');
const crypto = require('crypto');
dotenv.config();
const corsOptions  = {
  credentials: true
}
const app: Express = express();
app.use(cors(corsOptions));

app.use(session({secret:'test'}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 3001


//console.log(token)

app.get('*', function(req:Request, res:Response, next:any) {
  console.log(req.path)
  return next();
});

app.get('/',(req: Request,res: Response)=>{
	res.send('TypeScript, Here I come');
});
app.get('/products',async (req: Request,res: Response)=>{
  console.log('bgfgytfdr')
  console.log(orm)
  res.json({data:true});
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
    const userObject: TypeUser = {
      fullname: `${user.firstname} ${user.lastname}`,
      username: user.username,
      location: user.location,
      email: 'martintembo.zm@gmail.com',
      password: user.password,
      phone:'null',
      photo:'null',
      userId: token
    }
    var addr = req.socket.remoteAddress || '';
    try{
      let info = await ipinfoWrapper.lookupIp(addr.split(':')[1]);
      userObject.location = `${info.city}, ${info.country} [${info.countryCode}]`;
        //console.log(userObject);
        let status = await orm.addUser(userObject);
        console.log(status)
        if(status){
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
  res.json({status:false});
})
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});