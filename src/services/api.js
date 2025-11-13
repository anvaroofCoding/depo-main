import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    // 🔹 Oddiy baseQuery yaratamiz
    const base = fetchBaseQuery({
      baseUrl: "https://depoback.tm1.uz/api",
      credentials: "include",
      prepareHeaders: (headers) => {
        const token = localStorage.getItem("tokens");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    });

    // 🔹 So‘rovni yuboramiz
    const result = await base(args, api, extraOptions);

    // 🔹 Agar 401 yoki 403 bo‘lsa — login sahifasiga yuboramiz
    if (result?.error?.status === 401 || result?.error?.status === 403) {
      localStorage.removeItem("tokens");
      window.location.href = "/login";
    }

    return result;
  },
  tagTypes: ["Depo", "Auth", "Jadval"],
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
        url: "/harakat-tarkibi-active/",
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
    getNosozlik: builder.query({
      query: (search) => ({
        url: "/nosozliklar/",
        method: "GET",
        params: {
          search,
        },
      }),
      providesTags: ["Depo"],
    }),
    addNosozlik: builder.mutation({
      query: (formData) => ({
        url: "/nosozliklar/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Depo"],
    }),
    exportExcelTexnikStep: builder.query({
      query: () => ({
        url: "/texnik-korik/export-excel/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportPdftTexnikStep: builder.query({
      query: () => ({
        url: "/texnik-korik/export-pdf/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getDetailehtiyotqism: builder.query({
      query: ({ id, search }) => ({
        url: `/ehtiyot-qismlari/${id}/miqdorlar/`,
        method: "GET",
        params: {
          search,
        },
      }),
      providesTags: ["ehtiyots"],
    }),
    addEhtiyotFetail: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/ehtiyot-qismlari/${id}/add-miqdor/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ehtiyots", "Depo"],
    }),
    kunlikYurishDetail: builder.query({
      query: ({ id, search }) => ({
        url: `/kunlik-yurish-history/${id}`,
        method: "GET",
        params: {
          search,
        },
      }),
      providesTags: ["ehtiyotss"],
    }),
    addKunlikYurish: builder.mutation({
      query: (formData) => ({
        url: `/kunlik-yurish/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ehtiyotss"],
    }),
    getharakatGet: builder.query({
      query: () => ({
        url: "harakat-tarkibi",
        method: "GET",
      }),
      providesTags: ["Depo"],
    }),
    getehtiyotStatis: builder.query({
      query: () => ({
        url: "/ehtiyot-qismlari/",
        method: "GET",
      }),
      providesTags: ["Depo"],
    }),
    GetStatis: builder.query({
      query: () => ({
        url: "/korik-nosozlik/",
        method: "GET",
      }),
      providesTags: ["Depo"],
    }),
    NosozlikTypeAdd: builder.query({
      query: () => ({
        url: "/nosozlik-turlari/",
        method: "GET",
      }),
      providesTags: ["Depo"],
    }),
    NosozlikAddTypePost: builder.mutation({
      query: (formData) => ({
        url: `/nosozlik-turlari/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Depo"],
    }),
    NosozlikTypeEdit: builder.mutation({
      query: ({ id, nosozlik_turi }) => ({
        url: `/nosozlik-turlari/${id}/`,
        method: "PUT",
        body: { nosozlik_turi },
      }),
      invalidatesTags: ["Depo"], // kerak bo‘lsa
    }),
    defective: builder.query({
      query: ({ defective_id, search }) => ({
        url: `/nosozliklar/${defective_id}/`,
        method: "GET",
        params: {
          search,
        },
      }),
      providesTags: ["Depo"],
    }),
    defectiveExcel: builder.query({
      query: () => ({
        url: "/nosozliklar/export-excel",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    defectivePdf: builder.query({
      query: () => ({
        url: "/nosozliklar/export-pdf/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    addDefectiveSteps: builder.mutation({
      query: (formData) => ({
        url: `/nosozlik-steps/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Depo"],
    }),
    getOneDepos: builder.query({
      query: (id) => ({
        url: `/elektro-depo/${id}`,
        method: "GET",
      }),
      providesTags: ["Depo"],
    }),
    getHarakatForDepo: builder.query({
      query: ({ search = "" } = {}) => ({
        url: "/harakat-tarkibi",
        method: "GET",
        params: {
          search,
        },
      }),
      providesTags: ["Depo"],
    }),
    GetHarakatForTexnikKorik: builder.query({
      query: () => ({
        url: "/harakat-tarkibi/",
        method: "GET",
      }),
      providesTags: ["Depo"],
    }),
    getTamirForTexnikKorik: builder.query({
      query: (id) => ({
        url: `/tarkib-detail/${id}`,
        method: "GET",
      }),
      providesTags: ["ehtiyotss"],
    }),
    getTexnikKorikForTables: builder.query({
      query: () => ({
        url: `/texnik-korik/`,
        method: "GET",
      }),
      providesTags: ["ehtiyotss"],
    }),
    exportPDFtexnik: builder.query({
      query: (id) => ({
        url: `/texnik-korik-step1/${id}/export-pdf`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportPDFtarkibTexnikDetails: builder.query({
      query: (id) => ({
        url: `/texnik-korik-step1/${id}/export-pdf`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportExcelData: builder.query({
      query: (id) => ({
        url: `/tarkib-detail/${id}/export-excel`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportPDFData: builder.query({
      query: (id) => ({
        url: `/tarkib-detail/${id}/export-pdf`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportExcelTamir: builder.query({
      query: ({ id, tamir_id }) => ({
        url: `/texnik-korik-bytype/${id}/${tamir_id}/export-excel/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportPDFTamir: builder.query({
      query: ({ id, tamir_id }) => ({
        url: `/texnik-korik-bytype/${id}/${tamir_id}/export-pdf/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getTamirForData: builder.query({
      query: () => ({
        url: `/tamir-turi/`,
        method: "GET",
      }),
      providesTags: ["ehtiyotss"],
    }),
    exportPDFnosoz: builder.query({
      query: (id) => ({
        url: `/texnik-korik-step1/${id}/export-pdf`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportExcelNosoz: builder.query({
      query: (id) => ({
        url: `/nosozliklar-export-bytarkib/${id}/export-excel/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exportPDFNosoz: builder.query({
      query: (id) => ({
        url: `/nosozliklar-export-bytarkib/${id}/export-pdf/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getJadval: builder.query({
      query: ({ tarkib_id }) => ({
        url: `/texnik-korik-jadval/?tarkib=${tarkib_id}`,
        method: "GET",
      }),
      providesTags: ["Jadval"],
    }),
    addJadval: builder.mutation({
      query: (formData) => ({
        url: "/texnik-korik-jadval/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Jadval"],
    }),
    exporExcelJadval: builder.query({
      query: () => ({
        url: `/texnik-korik-jadval/export_excel/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exporPDFJadval: builder.query({
      query: ({ oy, yil }) => ({
        url: `/texnik-korik-jadval/export_pdf/?month=${oy}&year=${yil}`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    deleteJadval: builder.mutation({
      query: (id) => ({
        url: `/texnik-korik-jadval/${id}/`, // masalan: /api/jadval/5/
        method: "DELETE",
      }),
      invalidatesTags: ["Jadval"], // ro‘yxatni yangilaydi
    }),
    texnikHOlatStatistik: builder.query({
      query: () => ({
        url: `/harakat-tarkibi-holat-statistika`,
        method: "GET",
      }),
      providesTags: ["depo"],
    }),
    exporExcelAllTexnikKorik: builder.query({
      query: () => ({
        url: `/harakat-tarkibi-holat-statistika/export-excel/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exporPDFAllTexnikKorik: builder.query({
      query: () => ({
        url: `/harakat-tarkibi-holat-statistika/export-pdf/?type=nosozlikda/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    exporPDFAllTexnikKorikTexnik: builder.query({
      query: () => ({
        url: `/harakat-tarkibi-holat-statistika/export-pdf/?type=texnik/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    EcxelSteps: builder.query({
      query: ({ ide }) => ({
        url: `/texnik-korik-step1/${ide}/export-excel/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    PDFSteps: builder.query({
      query: ({ ide }) => ({
        url: `/texnik-korik-step1/${ide}/export-pdf/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    EcxelGet1: builder.query({
      query: ({ defective_id }) => ({
        url: `/texnik-korik-step1/${defective_id}/export-excel/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    PDFGet1: builder.query({
      query: ({ defective_id }) => ({
        url: `/texnik-korik-step1/${defective_id}/export-pdf/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getNotificationNosozlik: builder.query({
      query: () => ({
        url: `/notifications`,
        method: "GET",
      }),
      providesTags: ["Jadval"],
    }),
    getMashrut: builder.query({
      query: () => ({
        url: `/marshrut-jadval`,
        method: "GET",
      }),
      providesTags: ["Jadval"],
    }),
    addMarshrut: builder.mutation({
      query: (formData) => ({
        url: "/marshrut-jadval/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Jadval"],
    }),
    editMarshrut: builder.mutation({
      query: ({ id, data }) => ({
        url: `/marshrut-jadval/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Jadval"],
    }),
    getDate: builder.query({
      query: () => ({
        url: `/texnik-korik-jadval/available-months`,
        method: "GET",
      }),
      providesTags: ["Jadval"],
    }),
    editNotifications: builder.mutation({
      query: ({ id, payloads }) => ({
        url: `/notifications/${id}/mark_as_read/`,
        method: "PATCH",
        body: payloads,
      }),
      invalidatesTags: ["Jadval"],
    }),
  }),
});

export const {
  useEditNotificationsMutation,
  useGetDateQuery,
  useAddMarshrutMutation,
  useEditMarshrutMutation,
  useGetMashrutQuery,
  useGetNotificationNosozlikQuery,
  useLazyEcxelGet1Query,
  useLazyPDFGet1Query,
  useLazyEcxelStepsQuery,
  useLazyPDFStepsQuery,
  useLazyExporPDFAllTexnikKorikTexnikQuery,
  useLazyExporExcelAllTexnikKorikQuery,
  useLazyExporPDFAllTexnikKorikQuery,
  useTexnikHOlatStatistikQuery,
  useDeleteJadvalMutation,
  useLazyExporExcelJadvalQuery,
  useLazyExporPDFJadvalQuery,
  useAddJadvalMutation,
  useGetJadvalQuery,
  useLazyExportExcelNosozQuery,
  useLazyExportPDFNosozQuery,
  useLazyExportPDFnosozQuery,
  useGetTamirForDataQuery,
  useLazyExportExcelTamirQuery,
  useLazyExportPDFTamirQuery,
  useLazyExportExcelDataQuery,
  useLazyExportPDFDataQuery,
  useLazyExportPDFtarkibTexnikDetailsQuery,
  useLazyExportPDFtexnikQuery,
  useGetTexnikKorikForTablesQuery,
  useGetTamirForTexnikKorikQuery,
  useGetHarakatForTexnikKorikQuery,
  useGetHarakatForDepoQuery,
  useGetOneDeposQuery,
  useAddDefectiveStepsMutation,
  useLazyDefectiveExcelQuery,
  useLazyDefectivePdfQuery,
  useDefectiveQuery,
  useNosozlikTypeEditMutation,
  useNosozlikAddTypePostMutation,
  useNosozlikTypeAddQuery,
  useGetStatisQuery,
  useGetehtiyotStatisQuery,
  useGetharakatGetQuery,
  useAddKunlikYurishMutation,
  useKunlikYurishDetailQuery,
  useAddEhtiyotFetailMutation,
  useGetDetailehtiyotqismQuery,
  useAddNosozlikMutation,
  useGetNosozlikQuery,
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
