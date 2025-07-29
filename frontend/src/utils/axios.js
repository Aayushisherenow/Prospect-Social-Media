import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:"http://localhost:1234/api/v1",
  withCredentials: true,
});
