import axios from 'axios';

const API = axios.create({
  baseURL: '/api',   // backend compatible
  timeout: 4000,
});

// fetch a saved process form (data)
export const fetchProcessRecord = async (pcbSerial, stageId) => {
  const res = await API.get(`/pcb-operations/${pcbSerial}/${stageId}`);
  return res.data;
};

// save (create / update)
export const saveProcessRecord = async (payload) => {
  return API.post(`/pcb-operations`, payload);
};

// fetch form structure (optional backend support)
export const fetchFormTemplate = async (stageId) => {
  const res = await API.get(`/process-forms/${stageId}`);
  return res.data;
};
