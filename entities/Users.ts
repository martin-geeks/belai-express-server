import 'reflect-metadata';
import {ManyToOne,OneToMany,Entity,PrimaryGeneratedColumn,Column ,Relation,JoinColumn} from 'typeorm';
import {Sessions } from '../entities';

export interface TypeUser {
  fullname : string;
  username : string;
  location : string;
  phone: string;
  email: string;
  photo : string;
  userId: string;
  password: string;
}
export interface UniqueFields {
  phone : boolean;
  email: boolean;
  username: boolean;
}
type Email = string;
type Phone = string;
export type UserDeactivationDetail = Email | Phone
type key = number;
var id : key
var sessions : Sessions[]
@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: any;
  @Column('varchar',{length:100})
  fullname: any
  @Column('varchar',{length:100})
  username: any
  @Column('varchar',{length:100})
  email:any
  @Column('varchar',{length:100})
  phone: any
  @Column('varchar',{length:100})
  photo: any
  @Column('varchar',{length:100})
  location: any
  @Column('varchar')
  userId: any
  @Column('bool')
  active: any
  @OneToMany(()=> Sessions,(sessions:any) => sessions.user)
  //@ts-ignore
  sessions: Sessions[];
  @Column('varchar',{length: 20})
  password: any
  @Column('timestamp')
  joinedAt: any;
  
  
  constructor(repository: any) {
    
    this.client = repository;
    this.id  = id;
    this.active = false
    this.joinedAt = new Date();
    
    //this.sessions  = <Sessions>[]
  }
  
 async add(userObject: TypeUser) {
    this.fullname = userObject.fullname;
    this.username = userObject.username;
    this.photo = userObject.photo;
    this.email = userObject.email;
    this.phone = userObject.phone;
    this.userId = userObject.userId;
    this.location = userObject.location;
    this.password = userObject.password;
    //console.log(this.client.save(this))
    async function check(currentSession :any){
      let user = await currentSession.client.find();
      
      let username = user.filter( (data:any) => data.username == currentSession.username);
      let phone = user.filter( (data:any) => data.phone == currentSession.phone);
      let email = user.filter( (data:any) => data.email == currentSession.email);
      
      //console.log('Hi',username)
      return new Promise((resolve,reject)=>{
        if( (username.length >0) || (phone.length > 0) || (email.length > 0) ){
          let results: UniqueFields = {phone,email, username};
          //console.log(phone,email,username)
          if (username.length > 0) {
            results.username = true;
            
          } 
          if(phone.length > 0){
            results.phone = true;
            
          }
          if (email.length > 0) {
            results.email = true;
            
          }
          
          return reject(results);
        }
        currentSession.client.save(currentSession);
        return resolve(true);
      });
    }
   
    return new Promise((resolve,reject) => {
       check(this)
    .then( (auth:any) => {
      
      console.log('You can add',auth)
      //this.client.save(this);
      resolve({userId:this.userId,username:this.username})
    })
    .catch( (err: any) => {
      console.log('You can\'t add',err)
      
      reject(err);
    });
    });
  }
  get lastEntry() {
    return 0;
  }
  async toggleActive(userData:any){
    let userUpdate = await this.client.findOneBy(userData)
    
    //console.log(Object.getOwnPropertyNames(userUpdate))
    if(userUpdate) {
      userUpdate.active = (userUpdate === true) ? true :false;
      this.client.save(userUpdate);
      return userUpdate
    } else {
      return {status:false,message:`User with the following ${Object.keys(userData)}  ${Object.values(userData)} details doesn't exist`}
    }
    
 
  }
  
  client: any;
}