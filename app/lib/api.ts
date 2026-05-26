import axios from "axios";


const api = axios.create({
  baseURL: "http://35.178.111.40:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
  timeout: 10000,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timeout - server is not responding"));
    }
    
    if (!error.response) {
     
      return Promise.reject(new Error("Cannot connect to server. Check if backend is running at http://35.178.111.40:8000"));
    }
    
    return Promise.reject(error);
  }
);

export default api;
