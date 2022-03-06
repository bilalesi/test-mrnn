
import React from 'react'
import gererate_firebase_deeplink from '../lib/generate-firebase-deeplink';
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
    const [deepLink, setDeepLink] = React.useState("");
    const sendPushNotification = async (e) => {
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
        if(response.done){
            setIsPushSent(true);
        } else {
            setIsPushSent(false);
            setPushError(response.error);
        }
    }
    const generateDeepLink = async (e) => {
        e.preventDefault();
        let response = await fetch('/api/deep-linking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uri: profile.uri,
            }),
        })
        response = await response.json();
        console.log("response =>>>", response);
        setDeepLink(response.deeplink);
    }
    if (!exist) {
        return <div>User not found</div>
    }
    return (
        <div className='h-screen flex flex-col justify-center items-center'>
            <div>This page is for <strong>{profile.name}</strong></div>
            <div className='text-sm'>that has phone number <strong>{profile.phone}</strong></div>
            <button 
                type='button' 
                className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-3 mt-6'
                onClick={generateDeepLink}
            >
                <span>Share</span>
            </button>
            {deepLink && <a href={deepLink} className='text-sm p-4 text-red-600'>Deep Link</a>}
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
