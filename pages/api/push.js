import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import dbMiddleware from '../../lib/db-connector-middleware';
import run_send_push_notification from '../../lib/send-firebase-notification';

const handler = nextConnect();
handler.use(dbMiddleware);


handler.post(async (req, res) => {
    const { userId } = req.body;
    try {
        let user = await req.database.collection('users').findOne({ _id: ObjectId(userId) });
        if (!user) {
            res.status(404).json({ done: false, message: 'User not found', code: 'user_not_found' });
        }
        let registrationToken = user.firebase_token ||
            "dESeTO0NQVesFq5k1fFq2g:APA91bEhm2PK_6qaBbYDVvE9gZGAqMa28DsW7kG9b8aOJOcwqxa6n1vM1-4HOAPSLt7Hgr5kK7FT3eEsG86KcYHvBpdaPZBHjhHAXo6ApRZ5Qm3PAfi_wMo7KkflmGW8MPPRem5Qq7x1";
        if(!registrationToken){
            res.status(404).json({ done: false, message: 'User not yet registered', code: 'user_not_registered' });
        }
        let message = {
            notification: {
                title: "Welcome",
                body: "You have been successfully registered",
            },
        };
        let isSent = await run_send_push_notification(registrationToken, message);
        if(isSent){
            res.status(200).json({ done: true, message: 'Push notification sent', code: 'push_notification_sent' });
        }
        else{
            res.status(404).json({ done: false, message: 'Push notification not sent', code: 'push_notification_not_sent' });
        }
    } catch (error) {
        console.error("[send-push-notification-api]", error);
        res.status(500).json({ done: false, message: error.message, code: 'internal_error' });
    }
})

export default handler;