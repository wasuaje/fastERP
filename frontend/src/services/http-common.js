import Cookies from "js-cookie";
import axios from "axios";

export default axios.create({

  baseURL: process.env.REACT_APP_PUBLIC_API_URL  || 'api',  
  headers: {
    //headers: { Authorization: `Token ${Cookies.get("access_token")}` },
    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3YXN1YWplIiwiZXhwIjoxNjI2MTM0Nzc0fQ.YdnbS88xe3yBCI_Fw1TFwU452megb4HBnRJfjklo3yw`,
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*"

  }
});