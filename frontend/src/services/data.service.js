import http from "./http-common";

class DataService {    
  getAll(endpoint) {
    return http.get(`/${endpoint}`);
  }

  get(id, endpoint) {
    return http.get(`/${endpoint}/${id}`);
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