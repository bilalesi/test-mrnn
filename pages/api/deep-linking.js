import generate_firebase_deeplink from '../../lib/generate-firebase-deeplink';


export default async function handler(req, res){
    if(req.method === 'POST'){
        let { uri } =  req.body;
        try {
            const deeplink = await generate_firebase_deeplink({ userUri: uri });
            console.log("deeplink ==> ",deeplink);
            res.status(200).json({
                done: true,
                code: 'deeplink_generated',
                message: 'Deep Link Generated',
                deeplink
            })
        } catch (error) {
            console.log("generate deeplink", error);
            return res.status(500).json({
                done: false,
                code: 'deeplink_generation_failed',
                message: 'Deep Link Generation Failed',
                error
            })
        }
    }
}