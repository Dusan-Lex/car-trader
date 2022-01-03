// import { MongoClient, Db } from "mongodb";

// const url = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.szwyi.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;
// const dbName = process.env.mongodb_database;

// export let client: MongoClient;
// export let db: Db;

// export const connectToDatabase = async (): Promise<Db> => {
//   if (!db) {
//     console.info("Connecting to database");
//     client = await MongoClient.connect(url);
//     db = client.db(dbName);
//   }

//   return db;
// };

import { MongoClient } from "mongodb";

const DATABASE_URL = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.szwyi.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;
const MONGO_DB = process.env.mongodb_database;

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = MongoClient.connect(DATABASE_URL, opts)
      .then((client) => {
        return {
          client,
          db: client.db(MONGO_DB),
          error: false,
        };
      })
      .catch((error) => {
        return { error: true };
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
