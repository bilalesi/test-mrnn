
let firebase_rest_api_deeplink = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_API_KEY}`;
console.log("firebase_rest_api_deeplink", firebase_rest_api_deeplink);
export default async function gererate_firebase_deeplink({ userUri }){
    let response = await fetch(firebase_rest_api_deeplink, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dynamicLinkInfo: {
                domainUriPrefix: "https://rnappbx93tn.page.link",
                link: `https://test-mrnn.vercel.app/${userUri}`,
                androidInfo: {
                    androidPackageName: "com.rnapp",
                    androidFallbackLink: `https://test-mrnn.vercel.app/${userUri}`
                },
                iosInfo: {
                    iosBundleId: "org.reactjs.native.example.rnapp",
                    iosFallbackLink: `https://test-mrnn.vercel.app/${userUri}`
                },
            },
            suffix: {
                option: "UNGUESSABLE",
            }
        })
    })
    console.log('gererate_firebase_deeplink', response);
    let json = await response.json();
    return json.shortLink;
}
