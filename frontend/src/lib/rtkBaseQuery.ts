import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const rtkBaseQuery: BaseQueryFn = async (args, api, extraOpions) => {
  try {
    const result = await axiosInstance(args);
    return { data: result.data };
  } catch (error: any) {
    return {
      error: {
        status: error.response?.status,
        data: error.response?.data || error.message,
      },
    };
  }
};
