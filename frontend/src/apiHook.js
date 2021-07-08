import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import axios from 'axios';
import { ref } from 'yup';
 
 const useDataApi = (uri, meth, payl, refr, initialData) => {
  const base_url = process.env.REACT_APP_PUBLIC_API_URL  || 'api';
  const method = meth  || 'get';  
  const [payload, setPayload]  = useState(payl);
  const [refresh , setRefresh] = useState(refr);
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(base_url+uri);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
 
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
 
      try {
        const result = await axios({
            method: method,
            // headers: { Authorization: `Token ${Cookies.get("access_token")}` },
            headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3YXN1YWplIiwiZXhwIjoxNjI1NjEzNTUwfQ.FzlvhRu8GMzYABs9xe1hn-x8Sn4I1m4tdANZZBPvaQ0`},
            url: `${base_url}/api/${uri}`,
            data: payload,
        })
        // console.log(result.data)
         
        setData(result.data);
      } catch (error) {
        setIsError(true);
        setErrorMsg(error)
      }
 
      setIsLoading(false);
    };
 
    fetchData();
  }, [refresh,payload]); // Those ARE connectec
 
  return [ data, isLoading, isError, errorMsg , setRefresh, setPayload]; //THOSE are connected
};

export default useDataApi;