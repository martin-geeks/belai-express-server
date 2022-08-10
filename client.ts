import mongoose from 'mongoose';
//const mongoose = require('mongoose');
//import ServerApiVersion require('mongodb');
interface ConnectOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}
const options=  {
  useUnifiedTopology:true,
  useNewUrlParser:true,
  user:'belaiexpress',
  pass:'belai'
  //serverApi: ServerApiVersion.v1
}
//********FOR DEVELOPMENT MODE***********
/*async function  main(){
  return new Promise((resolve,reject) =>{
  mongoose.connect('mongodb://localhost:27017/belai-express').then(()=>{
  
    
    resolve(mongoose);
}).catch((err:any) => {
  console.log(err);
  reject(err)
  
});
  });
}*/
//*************FOR PRODUCTION***************
async function  main(){
  return new Promise(async (resolve,reject) =>{
  await mongoose.connect('mongodb+srv://cluster0.x6koa.mongodb.net/belaiexpress?retryWrites=true&w=majority',options, (err:any) => {
    console.log(err)
    console.log('connected')
    resolve(true);
  });
  
});
}
export {main}