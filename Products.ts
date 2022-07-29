import client from './client';
import{ Redisk,Entity,Property,Primary,Unique}from 'redisk';
var options = {
  url: 'redis://localhost:6379',
  host:'localhost',
  port: 6379,
  db:0
}
const redisk = Redisk.init(options);
const productsRepo = {
  
}

@Entity('user')
class User {
  @Primary()
  @Property()
  public readonly id: string
  
  
  @Property({searchable: true})
  public name : string
  
  @Unique()
  @Property()
  public email : string
  
  @Property({indexed: true,defaultValue: new Date()})
  public created: Date;
  constructor(id: string,name:string,email:string,created: Date) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.created = created;
  }
}
async function main(){
await redisk.save(new User('1','Martin Tembo','martintembo1',new Date()));
}
main();

async function fetchUser() {
  const user = await redisk.getOne(User,1);
  console.log(user)
  return user;
}
fetchUser();
export default  productsRepo;