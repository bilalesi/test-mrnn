import nextConnect from 'next-connect';
import dbMiddleware from '../../lib/db-connector-middleware';

const handler = nextConnect();
handler.use(dbMiddleware);

// attach registration token to user as firebase_token
handler.put(async (req, res) => {
    const { phone, token } = req.body;
    console.log("/api/attach-token-with-phone", { phone, token });
    if(!phone || !token) {
        return res.status(400).json({
            done: false,
            message: 'phone and token are required',
            code: 'missing_parameters',
        })
    }
    try {
        let user = await req.database.collection('users').updateOne({ phone: phone.toString().trim() },
                { $set: { firebase_token: token } });
        if(user.acknowledged && user.matchedCount === 1 && user.modifiedCount === 1)
            return res.status(200).json({ done: true, code: 'token_registered', message: 'Token registered' });
        else if(user.acknowledged && user.matchedCount === 1)
            return res.status(202).json({ done: true, code: 'token_already_registered', message: 'Token already registered' });
        else{
            console.log('==>>>>')
            return res.status(404).json({ done: true, code: 'user_not_found', message: 'User not found' });
        }
    } catch (error) {
        console.error("[attach-token-with-phone]", error);
        return res.status(500).json({ done: false, error: 'Error registering token' });
    }
});


export default handler;