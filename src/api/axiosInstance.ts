import axios from "axios";
import { getBackendApiBase } from "./backendBase";
const baseURL = getBackendApiBase();
const api = axios.create({
  baseURL,
});
export default api;
