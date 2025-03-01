import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || ""; // Убедитесь, что добавили URI в .env
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // В режиме разработки используем глобальный объект для кэширования клиента
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // В production создаем новый клиент
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
