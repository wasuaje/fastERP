import Cookies from "js-cookie";
import axios from "axios";

export default axios.create({

  baseURL: process.env.REACT_APP_PUBLIC_API_URL  || 'api',  
  headers: {
    //headers: { Authorization: `Token ${Cookies.get("access_token")}` },
    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3YXN1YWplIiwiZXhwIjoxNjI1Njk5Mzk0fQ.Pg5bN447qASxDxBs7HMifXq4KCHNPyoM2kE30LPIGss`,
    "Content-type": "application/json"
  }
});