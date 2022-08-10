import {Schema,Model} from 'mongoose';
import {TypeNotification,NotificationMethods} from '../types/api';
export type NotificationModel = Model<TypeNotification,{},NotificationMethods>
const notificationSchema = new Schema<TypeNotification,{},NotificationModel>({
  title: {type: String,default:'Unamed Notification', required:true},
  body: {type: String, required:true},
  pictures: Array<string>,
  urls: Array<string>,
  recipients:Array<string>, //{type: Array<string>,required:false,default:'None'},
  receivedBy:Array<string>,
  notificationId: {type: String,required:true},
  sendAt: {type: Date, required: false},
  createdAt: {type: Date,required: true,default:new Date},
});

notificationSchema.method('notification', function notification(){
  return this.title;
});

export default notificationSchema;