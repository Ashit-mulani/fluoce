import axios from "axios";
import { backendUrl, backendReadUrl, backendWriteUrl } from "../utils/const";

const authApi = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

const readApi = axios.create({
  baseURL: backendReadUrl,
  withCredentials: true,
});

const writeApi = axios.create({
  baseURL: backendWriteUrl,
  withCredentials: true,
});

export { authApi, readApi, writeApi };
