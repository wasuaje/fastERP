import Cookies from "js-cookie";
import axios from "axios";


export default axios.create({
  baseURL: process.env.REACT_APP_PUBLIC_API_URL  || 'api',  
  headers: {
    "Authorization": `Bearer ${Cookies.get("access_token")}`,    
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*"

  }
});