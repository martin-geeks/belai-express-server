
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Users,Sessions} from './entities';


const client = new DataSource({type: 'mysql',host:'192.168.43.214',port:3306,database:'belaiExpress',username:'root', password:'',entities:[Users,Sessions], migrationsRun: true,synchronize: false,
    logging: true,})

async function  connect (){
  return new Promise((resolve,reject) =>{
  client.initialize().then(()=>{
  
    //console.log(client.isConnected);
    resolve(client);
}).catch((err:any) => {reject(err)});
  });
}
/*
console.log(client)

connect()
.then((c: any) => {
  console.log(c)
  let fs = c.getRepository(Sessions);
  console.log(fs.save(new User()))
})
.catch((err :any) => {
  console.log('Error',err)
});
*/
export {connect}