import axios from "axios";
import appConfig from "../config/app-config";
import stateService from "./state-service";

const api = axios.create({
  baseURL: appConfig.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (stateService.auth?.token) {
    config.headers.Authorization = `Bearer ${stateService.auth.token}`;
  }
  return config;
});

export default api;
