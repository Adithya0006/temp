import axios from "axios";

// Backend Base URL
const API = axios.create({
  baseURL: "http://localhost:4000/api/admin",
  headers: {
    "Content-Type": "application/json"
  }
});

// ---------- MASTER ----------
export const saveToMaster = (data) => API.post("/master/save", data);
export const fetchMaster = () => API.get("/master/list");

// ---------- IN-ACTION ----------
export const fetchInAction = () => API.get("/inaction/list");
export const moveToInAction = (data) => API.post("/inaction/add", data);
export const moveBackToMaster = (serial) =>
  API.delete(`/inaction/remove/${serial}`);

// ---------- PROFILE ----------
export const createProfile = (data) => API.post("/profile/create");

// ---------- AUTH ----------
export const logoutAdmin = () => API.post("/logout");

export default API;
