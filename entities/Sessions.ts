import 'reflect-metadata';
import {ManyToOne,Entity,PrimaryGeneratedColumn,Column,Relation} from 'typeorm';
import {Users} from '../entities';
@Entity()
export class Sessions{
  @PrimaryGeneratedColumn()
  id: any;
  @Column('varchar',{length:100})
  username: any;
  @Column('varchar',{length:150})
  action: any;
  @Column('bool')
  success: any;
  @ManyToOne(()=> Users,(user:any) => user.session)
  //@ts-ignore
  user: Users;
  @Column('timestamp')
  createdAt: any;
  
  constructor(){
    
    this.success = false;
  }
  
}