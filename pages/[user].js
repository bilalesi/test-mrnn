
import React from 'react'

export const getServerSideProps = async ({ params }) => {
    const user = params.user;
    let response = await fetch(`${process.env.API_URI}/api/user?uri=${user}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log("response", response);
    response = await response.json();
    return {
        props: {
            exist: response.code === 'user_found',
            profile: response.user,
        },
    }
}


export default function User({ exist, profile }) {
    let [isPushSent, setIsPushSent] = React.useState(false);
    let [pushError, setPushError] = React.useState("");
    const sendPushNotification = async (e) => {
        console.log("sendPushNotification", e);
        console.log("profile", `/api/push`);
        e.preventDefault();
        let response = await fetch(`/api/push`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: profile._id || "62229c015f80a80125a242da",
            }),
        });
        response = await response.json();
        console.log("PUSH response", response);
        if(response.done){
            setIsPushSent(true);
        } else {
            setIsPushSent(false);
            setPushError(response.error);
        }
    }
    if (!exist) {
        return <div>User not found</div>
    }
    return (
        <div className='h-screen flex flex-col justify-center items-center'>
            <div>This page is for <strong>{profile.name}</strong></div>
            <div className='text-sm'>that has phone number <strong>{profile.phone}</strong></div>
            <button type='button' className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-3 mt-6'>
                <span>Share</span>
            </button>
            <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                onClick={sendPushNotification}
                type='button'
            >
                <span>Send Notification</span>
            </button>
            {isPushSent && <div className='text-green-500 text-center fixed left-1/2 transform -translate-x-1/2 bottom-4 transition-all ease-out  rounded-lg bg-white shadow-lg px-5 py-3 font-bold'>Push notification sent successfully</div>}
            {!isPushSent && pushError && <div className='text-red-500 text-center fixed left-1/2 transform -translate-x-1/2 bottom-4 transition-all ease-out rounded-lg bg-white shadow-lg px-5 py-3 font-bold'>{pushError}</div>}
        </div>

    )
}
