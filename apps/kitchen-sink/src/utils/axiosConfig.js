import axios from "axios";
const BASE_URL = "https://raw.githubusercontent.com/mondaycom/welcome-apps/kitchen-sink/apps/kitchen-sink/src/examples/";
export const instance = axios.create({
  headers: {
    "content-type": "application/json",
  },
  baseURL: BASE_URL,
});

export default instance;
