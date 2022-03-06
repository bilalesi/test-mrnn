import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import dbMiddleware from '../../lib/db-connector-middleware';
import run_send_push_notification from '../../lib/send-firebase-notification';

const handler = nextConnect();
handler.use(dbMiddleware);


handler.post(async (req, res) => {
    const { userName, userId } = req.body;
    console.log({userName, userId});
    try {
        let users = await req.database.collection('users').find({
            firebase_token: { $exists: true, $nin: ["", null] },
            _id: { $ne: [ObjectId(userId)] }
        }).toArray();
        console.log("user to sent notification", users);
        let registrationTokens = users.map(user => user.firebase_token);
        if (users.length <= 0 || registrationTokens.length <= 0) {
            return res.status(200).json({ done: true, message: 'Empty set to send push', code: "empty_set" });
        }
        let message = {
            notification: {
                title: "Hi",
                body: "Notification from " + userName,
            },
        };
        let isSent = await run_send_push_notification(registrationTokens, message);
        if(isSent){
            res.status(200).json({ done: true, message: 'Push notification sent', code: 'push_notification_sent', count: users.length });
        }
        else{
            res.status(404).json({ done: false, message: 'Push notification not sent', code: 'push_notification_not_sent' });
        }
    } catch (error) {
        console.error("[send-push-notification-bulk-api]", error);
        res.status(500).json({ done: false, message: error.message, code: 'internal_error' });
    }
})

export default handler;