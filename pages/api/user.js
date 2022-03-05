import { nanoid } from 'nanoid';
import nextConnect from 'next-connect';
import dbMiddleware from '../../lib/db-connector-middleware';

const handler = nextConnect();
handler.use(dbMiddleware);

handler.get(async (req, res) => {
    let user = req.query.uri;
    console.log("user", user);
    try {
        let userDocument = await req.database.collection('users').findOne({ uri: user });
        console.log("userDocument", userDocument);
        if (!userDocument) {
            return res.status(404).json({
                done: true,
                code: 'not_found',
                message: 'User not found',
            });
        }
        return res.status(200).json({
            done: true,
            message: 'User fetched successfully',
            code: 'user_found',
            user: userDocument
        });
    } catch (error) {
        console.error("[fetch-user-by-uri]", error);
        return res.status(500).json({
            done: false,
            code: 'internal_error',
            message: 'Internal server error',
        })
    }
})

handler.post(async (req, res) => {
    let { name, phone } = req.body;
    if(!name || !phone) {
        return res.status(400).json({
            done: false,
            code: 'missing_parameters',
            message: 'Missing parameters',
        })
    }
    try {
        let userDocument = await req.database.collection('users').findOne({ phone: phone.trim() });
        if (userDocument) {
            return res.status(404).json({
                done: true,
                code: 'user_exists',
                message: 'User already exists',
            })
        }
        let documentInserted = await req.database.collection('users').insertOne({
            name, phone, createdAt: new Date(),
            uri: `${name.trim().toLowerCase()}-${nanoid(6)}`,
        });
        return res.status(200).json({
            done: true,
            message: 'User created successfully',
            code: 'user_created_succeeded',
            id: documentInserted.insertedId,
        });
    } catch (error) {
        console.error("[create-user-api]", error);
        return res.status(500).json({
            done: false,
            code: 'internal_error',
            message: 'Internal server error',
        })
    }
})

export default handler;