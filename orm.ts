import 'reflect-metadata'
import {connect as client}from './client';
import {Users,TypeUser,UniqueFields,Sessions} from './entities';

export interface NewUserType {
      fullname: string;
      username: string;
      location: string;
      email: string;
      password: string;
      phone: string;
      userId: string;
}

async function addUser(userObject :TypeUser){
  return new Promise((resolve,reject) => {
  client().then(async (data :any )=>{
    const userRepository = data.getRepository(Users);
    const user1 = new Users(userRepository);
    console.log(user1)
    console.log(await userRepository.findOneBy({id:1}));
    
    
    
    await user1.add(userObject).then((status: any ) => {resolve(status) }).catch((err: UniqueFields) => {reject(err)});
   data.destroy();
    
  }).catch();
});
}


//addUser();
async function addSession() {
  
  client()
  .then( async (data: any) => {
    let d = data.getRepository(Sessions);
    let u = data.getRepository(Users);
    let user = await u.findOneBy({id:1});
    console.log(typeof user)
    let s = new Sessions();
    s.action = 'Sent feedback';
    s.username = 'michael-codejs';
    s.success = false;
    s.user = user;
    d.save(s)
  })
  .catch((err:any) => {
    
  });
}

//addSession();

/*
async function userDeactivation(){
  client().then(async (data:any) => {
    let userRepository = data.getRepository(User);
   /let user = new User(userRepository);
    let userStatus = await  user.toggleActive({username:'michal.codes-js'});
    console.log(userStatus)
  })
  .catch();
}

//userDeactivation();
*/
const orm = {
  addUser: addUser,
}
export default orm;