import { Schema, model } from 'mongoose';
import * as mongoose from 'mongoose';

mongoose.pluralize(null);

export const <%= entityNameLowerCase %>Schema = new Schema({
  field: String
}, {
  timestamps: true
});

const <%= entityNameLowerCase %>Model = model('<%= entityNameLowerCase %>', <%= entityNameLowerCase %>Schema);

export default <%= entityNameLowerCase %>Model;
