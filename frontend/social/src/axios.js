import axios from "axios";

export const makeRequest = axios.create({
    baseURL: "https://is-media.onrender.com/api/v1/",
    withCredentials: true,
});
