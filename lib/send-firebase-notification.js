import firebaaseAdmin from 'firebase-admin';


var serviceAccount = require("./mrnn-service-account.json");

if(firebaaseAdmin.apps.length === 0) {
    firebaaseAdmin.initializeApp({
        credential: firebaaseAdmin.credential.cert(serviceAccount),
        databaseURL: "https://mrnn-7e353.firebaseio.com"
    });
}



export default async function sendFirebaseNotification(token, message) {
    try {
        let result  = await firebaaseAdmin.messaging().sendToDevice(token, message, {
            priority: "high",
            timeToLive: 60 * 60 * 24,
        });
        console.log("sendFirebaseNotification", result);
        return true;
    } catch (error) {
        console.error("[sendFirebaseNotification] error", error);
        return false;
    }

}