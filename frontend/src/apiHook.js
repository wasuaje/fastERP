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
 
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
 
      try {
        const result = await axios({
            method: method,
            // headers: { Authorization: `Token ${Cookies.get("access_token")}` },
            headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3YXN1YWplIiwiZXhwIjoxNjI1MDkyMzkzfQ.wfWAKDtQjaWRhmMul7MQq5U82A_IK2nbh-xUkWVixok`},
            url: `${base_url}/api/${uri}`,
            data: payload,
        })
        // console.log(result.data)
 
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }
 
      setIsLoading(false);
    };
 
    fetchData();
  }, [refresh,payload]);
 
  return [{ data, isLoading, isError }, setRefresh, setPayload];
};

export default useDataApi;