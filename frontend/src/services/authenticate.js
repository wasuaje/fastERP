import Cookies from 'js-cookie'
// import API from "./api";
import DataService from "./data.service";

const getAccessToken = () => Cookies.get('access_token')
function Error(message) {
    this.message = message;
    this.name = 'UserException';
}
export default function authenticate(user, pass)  {
    var payload = {'username': user, 'password':pass}
    var error = "";
    if (!getAccessToken()) {

        const tokens = API('api-token-auth', 'post', payload)
            .then(data => {
                console.log("token:", data)
                const expires = (tokens.expires_in || 60 * 60) * 1000
                const inOneHour = new Date(new Date().getTime() + expires)

                // you will have the exact same setters in your Login page/app too
                Cookies.set('access_token', data.token, { expires: inOneHour })
                // Cookies.set('refresh_token', tokens.refresh_token)
                window.location.replace(
                    `${window.location.href}`
                )
            })
            .catch(err => {
                    error = err
                    console.log("Error getting token: ", error.response)
                })

    }
    console.log("err: no cookie token")
}