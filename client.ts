import mongoose from 'mongoose';

async function  main(){
  return new Promise((resolve,reject) =>{
  mongoose.connect('mongodb://localhost:27017/belai-express').then(()=>{
  
    
    resolve(mongoose);
}).catch((err:any) => {
  console.log(err);
  reject(err)
  
});
  });
}

export {main}