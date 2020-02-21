import { Schema, model } from 'mongoose';
import * as mongoose from 'mongoose';

mongoose.pluralize(null);

// tslint:disable-next-line: variable-name
export const <%= entityName %>Schema = new Schema({
  field: String
}, {
  timestamps: true
});
// tslint:disable-next-line: variable-name
export const <%= entityName %>Model = model('<%= entityNameLowerCase %>', <%= entityName %>Schema);
