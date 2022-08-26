import {Model,Schema} from 'mongoose';
import {TypeCategoryArrangement,CategoryArrangementMethods,TypeCategory} from '../types/api';


export type CategoryArrangementModel = Model<TypeCategoryArrangement,{},CategoryArrangementMethods>;
const categoryArrangementSchema = new Schema<TypeCategoryArrangement,CategoryArrangementMethods>({
  editor: {type: String, required:true},
  editorId: {type: String, required:true},
  arrangement: Array<string>,
  date: {type:Date, default:new Date},
});

categoryArrangementSchema.method('arrange', function arrange(categoryArrangement: TypeCategory[]){});
categoryArrangementSchema.method('rearrange', function rearrange(userId: string,productId:string){});
categoryArrangementSchema.method('clearArrange', function resetArrangement(userId: string){});

export default categoryArrangementSchema;