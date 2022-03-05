import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import dbMiddleware from '../../lib/db-connector-middleware';

const handler = nextConnect();
handler.use(dbMiddleware);

// add registration token to user as  firebase_token
handler.post(async (req, res) => {
    const { userId, token } = req.body;
    if(!userId || !token) {
        return res.status(400).json({
            done: false,
            message: 'userId and token are required',
            code: 'missing_parameters',
        })
    }
    try {
        let user = await req.database.collection('users').updateOne({ _id: ObjectId(userId) },
                { $set: { firebase_token: token } });
        console.log("uer ==>",user);
        if(user.acknowledged && user.matchedCount === 1 && user.modifiedCount === 1)
            return res.status(200).json({ done: true, code: 'token_registered', message: 'Token registered' });
        else if(user.acknowledged && user.matchedCount === 1)
            return res.status(202).json({ done: true, code: 'token_already_registered', message: 'Token already registered' });
        else
            return res.status(404).json({ done: true, code: 'user_not_found', message: 'User not found' });
    } catch (error) {
        console.error("[register-fcm-token-api]", error);
        return res.status(500).json({ error: 'Error registering token' });
    }
});


export default handler;