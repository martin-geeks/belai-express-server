import mongoose from 'mongoose';

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
async function  main(){
  return new Promise((resolve,reject) =>{
  mongoose.connect('mongodb+srv://martintembo1:$9th_April_2017&@cluster0.x6koa.mongodb.net/?retryWrites=true&w=majority').then(()=>{
  
    
    resolve(mongoose);
}).catch((err:any) => {
  console.log(err);
  reject(err)
  
});
  });
}
export {main}