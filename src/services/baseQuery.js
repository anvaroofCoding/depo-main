import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.10.41:8090/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("tokens");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401 || result?.error?.status === 403) {
    // Token eskirgan yoki yaroqsiz
    localStorage.removeItem("tokens");
    window.location.href = "/login"; // login sahifasiga yuborish
  }

  return result;
};

export default baseQueryWithReauth;
