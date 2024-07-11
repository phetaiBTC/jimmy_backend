import { Schema, model } from "mongoose"
const userSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum:['Admin','User']
  },
  numberPhone:{
    type:String
  },
  avatar:{
    type:String
  },
  mobile:{
    type:String
  }
}, { timestamps: true })
const Users = model('Users', userSchema, 'Users')
export default Users