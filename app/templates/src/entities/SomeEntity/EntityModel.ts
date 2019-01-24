import { Schema, model } from 'mongoose';
import * as mongoose from 'mongoose';

mongoose.pluralize(null);

const databaseSchema = new Schema({
  field: String
}, {
  timestamps: true
});

const <%= modelName %> = model('<%= entityNameLowerCase %>', databaseSchema);

export default <%= modelName %>;