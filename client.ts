//import mongoose from 'mongoose';
const mongoose = require('mongoose');
//import ServerApiVersion require('mongodb');
const dotenv =  require('dotenv');
dotenv.config();
interface ConnectOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}
const options=  {
  useUnifiedTopology:true,
  useNewUrlParser:true,
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PASSWORD
  //serverApi: ServerApiVersion.v1
}
const atlas = process.env.DATABASE_ATLAS_URL;
//********FOR DEVELOPMENT MODE***********

async function  main(){
  return new Promise((resolve,reject) =>{
  mongoose.connect(process.env.DATABASE_URL).then(()=>{
  
    
    resolve(mongoose);
}).catch((err:any) => {
  console.log(err);
  reject(err)
  
});
  });
}

//*************FOR PRODUCTION***************
/*
async function  main(){
  return new Promise(async (resolve,reject) =>{
  await mongoose.connect(process.env.DATABASE_ATLAS_URL,options, (err:any) => {
    console.log(err)
    console.log('connected')
    resolve(true);
  });
  
});
}
*/
export {main}
