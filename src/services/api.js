import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.10.41:8090/api",
    credentials: "include", // cookie ishlatadi
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("tokens");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Depo", "Auth"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/token/", // backenddagi login endpointingiz
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        // Tokenni saqlash
        if (response?.access_token) {
          localStorage.setItem("tokens", response.access_token);
        }
        return response;
      },
      invalidatesTags: ["Auth"],
    }),
    getDep: builder.query({
      query: () => ({
        url: "/elektro-depo/",
        method: "GET",
      }),
      providesTags: ["Depo"],
    }),
    addDep: builder.mutation({
      query: (formData) => ({
        url: "/elektro-depo/",
        method: "POST",
        body: formData, // FormData
      }),
      invalidatesTags: ["Depo"],
    }),
    updateDepo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/elektro-depo/${id}/`,
        method: "PUT",
        body: data, // FormData bo'lsa, fetch avtomatik 'multipart/form-data' yuboradi
        // headers: { 'Content-Type': 'multipart/form-data' } // qo'lda yozmang
      }),
      invalidatesTags: ["Depo"],
    }),
    deleteDepo: builder.mutation({
      query: (id) => ({
        url: `/elektro-depo/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Depo"],
    }),
    getharakat: builder.query({
      query: ({ limit = 8, page = 1, search = "" } = {}) => ({
        url: "/harakat-tarkibi/",
        method: "GET",
        params: {
          limit,
          page,
          search,
        },
      }),
      providesTags: ["Depo"],
    }),
    addtarkib: builder.mutation({
      query: (formData) => ({
        url: "/harakat-tarkibi/",
        method: "POST",
        body: formData, // FormData
      }),
      invalidatesTags: ["Depo"],
    }),
    deleteTarkib: builder.mutation({
      query: (id) => ({
        url: `/harakat-tarkibi/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Depo"],
    }),
    updateHarakat: builder.mutation({
      query: ({ id, data }) => ({
        url: `/harakat-tarkibi/${id}/`,
        method: "PUT",
        body: data, // FormData bo'lsa, fetch avtomatik 'multipart/form-data' yuboradi
        // headers: { 'Content-Type': 'multipart/form-data' } // qo'lda yozmang
      }),
      invalidatesTags: ["Depo"],
    }),
    getProfileMe: builder.query({
      query: () => ({
        url: "/me/",
        method: "GET",
      }),
      providesTags: ["Depo"],
    }),
    getehtiyot: builder.query({
      query: ({ limit = 10, page = 1, search = "" } = {}) => ({
        url: "/ehtiyot-qismlari/",
        method: "GET",
        params: {
          limit,
          page,
          search,
        },
      }),
      providesTags: ["Depo"],
    }),
    addehtiyot: builder.mutation({
      query: (formData) => ({
        url: "/ehtiyot-qismlari/",
        method: "POST",
        body: formData, // FormData
      }),
      invalidatesTags: ["Depo"],
    }),
    deleteehtiyot: builder.mutation({
      query: (id) => ({
        url: `/ehtiyot-qismlari/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Depo"],
    }),
    updateehtiyot: builder.mutation({
      query: ({ id, data }) => ({
        url: `/ehtiyot-qismlari/${id}/`,
        method: "PUT",
        body: data, // FormData bo'lsa, fetch avtomatik 'multipart/form-data' yuboradi
        // headers: { 'Content-Type': 'multipart/form-data' } // qo'lda yozmang
      }),
      invalidatesTags: ["Depo"],
    }),
    gettamir: builder.query({
      query: ({ limit = 10, page = 1, search = "" } = {}) => ({
        url: "/tamir-turi/",
        method: "GET",
        params: {
          limit,
          page,
          search,
        },
      }),
      providesTags: ["Depo"],
    }),
    addtamir: builder.mutation({
      query: (formData) => ({
        url: "/tamir-turi/",
        method: "POST",
        body: formData, // FormData
      }),
      invalidatesTags: ["Depo"],
    }),
    deletetamir: builder.mutation({
      query: (id) => ({
        url: `/tamir-turi/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Depo"],
    }),
    updatetamir: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tamir-turi/${id}/`,
        method: "PUT",
        body: data, // FormData bo'lsa, fetch avtomatik 'multipart/form-data' yuboradi
        // headers: { 'Content-Type': 'multipart/form-data' } // qo'lda yozmang
      }),
      invalidatesTags: ["Depo"],
    }),
    exportExcel: builder.query({
      query: () => ({
        url: "/ehtiyot-qismlari/export-excel/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportPdf: builder.query({
      query: () => ({
        url: "/ehtiyot-qismlari/export-pdf/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportExcelh: builder.query({
      query: () => ({
        url: "/harakat-tarkibi/export-excel/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportPdfh: builder.query({
      query: () => ({
        url: "/harakat-tarkibi/export-pdf/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportExcelt: builder.query({
      query: () => ({
        url: "/tamir-turi/export-excel/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportPdft: builder.query({
      query: () => ({
        url: "/tamir-turi/export-pdf/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getOneDepo: builder.query({
      query: (id) => ({
        url: `/harakat-tarkibi/${id}`,
        method: "GET",
      }),
      providesTags: ["Depo"],
    }),
    getTexnikAdd: builder.query({
      query: (search) => ({
        url: "/texnik-korik/",
        method: "GET",
        params: {
          search,
        },
      }),
      providesTags: ["Depo"],
    }),
    exportExcelTexnik: builder.query({
      query: () => ({
        url: "/texnik-korik/export-excel/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportPdftTexnik: builder.query({
      query: () => ({
        url: "/texnik-korik/export-pdf/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    deletetexnikKorik: builder.mutation({
      query: (id) => ({
        url: `/texnik-korik/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Depo"],
    }),
    addTexnik: builder.mutation({
      query: (formData) => ({
        url: "/texnik-korik/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Depo"],
    }),
    getTexnikDetails: builder.query({
      query: ({ ide, search }) => ({
        url: `/texnik-korik/${ide}`,
        method: "GET",
        params: {
          search,
        },
      }),
      providesTags: ["Depo"],
    }),
    addTexnikDetail: builder.mutation({
      query: (formData) => ({
        url: "/texnik-korik-steps/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Depo"],
    }),
  }),
});

export const {
  useAddTexnikDetailMutation,
  useGetTexnikDetailsQuery,
  useAddTexnikMutation,
  useDeletetexnikKorikMutation,
  useLazyExportExcelTexnikQuery,
  useLazyExportPdftTexnikQuery,
  useGetTexnikAddQuery,
  useGetOneDepoQuery,
  useLazyExportExceltQuery,
  useLazyExportPdftQuery,
  useLazyExportExcelhQuery,
  useLazyExportPdfhQuery,
  useLazyExportPdfQuery,
  useLazyExportExcelQuery,
  useUpdatetamirMutation,
  useDeletetamirMutation,
  useAddtamirMutation,
  useGettamirQuery,
  useUpdateehtiyotMutation,
  useDeleteehtiyotMutation,
  useAddehtiyotMutation,
  useGetehtiyotQuery,
  useGetProfileMeQuery,
  useUpdateHarakatMutation,
  useDeleteTarkibMutation,
  useAddtarkibMutation,
  useLoginMutation,
  useGetDepQuery,
  useAddDepMutation,
  useUpdateDepoMutation,
  useDeleteDepoMutation,
  useGetharakatQuery,
} = api;
