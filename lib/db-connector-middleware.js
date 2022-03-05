import { MongoClient }  from 'mongodb';
import nextConnect from 'next-connect';

const mongoClientInstance = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function dbConnector(req, res, next) {
    await mongoClientInstance.connect();
    req.mongoClient = mongoClientInstance;
    req.database = mongoClientInstance.db(process.env.MONGODB_DATABASE_NAME);
    return next();
}


const middleware = nextConnect();
middleware.use(dbConnector);


export default middleware;