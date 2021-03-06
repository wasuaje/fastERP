import axios from "axios";
import http from "./http-common";

class DataService {    
  getAll(endpoint) {
    return http.get(`/${endpoint}`);
  }

  get(id, endpoint) {
    return http.get(`/${endpoint}/${id}`);
  }

  login(endpoint, data) {
    const params = new URLSearchParams()
      params.append('username', data.username)
      params.append('password', data.password)
    const loginRequest = axios.create({      
      baseURL: process.env.REACT_APP_PUBLIC_API_URL  || 'api',  
      headers : {
        "accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    
    return loginRequest.post(`/${endpoint}`, params);
  }

  create(endpoint, data) {
    return http.post(`/${endpoint}`, data);
  }

  update(endpoint, data) {
    return http.patch(`/${endpoint}`, data);
  }

  delete(endpoint, data) {      
    return http.delete(`/${endpoint}`, {data:data});
  }

  deleteAll(endpoint) {
    return http.delete(`/${endpoint}`);
  }

  findByTitle(title, endpoint) {
    return http.get(`/${endpoint}?title=${title}`);
  }
}

export default new DataService();