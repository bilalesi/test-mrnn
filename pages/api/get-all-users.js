import { nanoid } from 'nanoid';
import nextConnect from 'next-connect';
import dbMiddleware from '../../lib/db-connector-middleware';

const handler = nextConnect();
handler.use(dbMiddleware);


handler.get(async (req, res) => {
    try {
        let users = await req.database.collection('users').find({ }).toArray();
        return res.status(200).json({
            done: true,
            message: 'Fetch users successfully',
            code: 'fetch_users_succeeded',
            users
        });
    } catch (error) {
        console.error("[get-all-users-api]", error);
        return res.status(500).json({
            done: false,
            code: 'internal_error',
            message: 'Internal server error',
        })
    }
})

export default handler;