import { GoogleSignin } from 'react-native-google-signin';

const GoogleSign = async () => {
    GoogleSignin.configure({
        scopes: ['email'],
        webClientId: '504019171585-v4giee3nevkhg38gstbq3jijjmv904q5.apps.googleusercontent.com',
        offlineAccess: true,
    })
    try {
        await GoogleSignin.hasPlayServices()
        const userInfo = await GoogleSignin.signIn()
        if (userInfo !== "") {
            return { "Data": { userInfo } }
        }
    } catch (error) {
        return { "Error": { error } }
    }
}

export default GoogleSign;