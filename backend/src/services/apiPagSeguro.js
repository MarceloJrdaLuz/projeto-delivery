import axios from "axios";

export const api = axios.create({
    baseURL: "https://sandbox.api.pagseguro.com/",
})
