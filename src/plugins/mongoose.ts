import { connect, ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbName: string = process.env.DB_NAME || 'basicAuthentication';

class Connect {
  uri: string;

  constructor() {
    this.uri = `mongodb://127.0.0.1:27017/${dbName}`;
  }
  async connect() {
    try {
      await connect(this.uri);
      console.log('Connected to', this.uri);
    } catch (error:any) {
      throw new Error('Error connecting to MongoDB: ' + error.message);
    }
  }
}

export default Connect;
