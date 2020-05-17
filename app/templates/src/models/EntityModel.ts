import { Schema, model } from 'mongoose';
import * as mongoose from 'mongoose';

mongoose.pluralize(null);

export const <%= entityName %>Schema = new Schema({
  field: String
}, {
  timestamps: true
});
export const <%= entityName %>Model = model('<%= entityNameLowerCase %>', <%= entityName %>Schema);
