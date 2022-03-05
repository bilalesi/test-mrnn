
let firebase_rest_api_deeplink = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_API_KEY}`;

export default async function gererate_firebase_deeplink({ userUri }){
    await fetch(firebase_rest_api_deeplink, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dynamicLinkInfo: {
                domainUriPrefix: 'https://deeplink.com',
                link: 'https://deeplink.com/',
                androidInfo: {
                    androidPackageName: 'com.instagram.android',
                    androidFallbackLink: 'https://deeplink.com/',
                    androidMinPackageVersionCode: 0
                },
                iosInfo: {
                    iosBundleId: 'com.example.ios',
                    iosFallbackLink: 'https://deeplink.com/',
                    iosCustomScheme: 'com.example.ios',
                    iosIpadBundleId: 'com.example.ios',
                    iosIpadFallbackLink: 'https://deeplink.com/',
                    iosMinimumVersion: '0'
                },
                navigationInfo: {
                    enableForcedRedirect: true
                }
            },
        })
    })
}
