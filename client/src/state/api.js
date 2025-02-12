import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL || "http://localhost:5001/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().global?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
    "Notifications",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard", "Customers", "Products", "Transactions"],
    }),
    updateUser: build.mutation({
      query: ({ userId, ...data }) => ({
        url: `user/${userId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    uploadPhoto: build.mutation({
      query: ({ userId, photo }) => {
        const formData = new FormData();
        formData.append('photo', photo);
        
        return {
          url: `user/${userId}/photo`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['User'],
    }),
    getUserNotifications: build.query({
      query: (userId) => ({
        url: `notifications/${userId}`,
        method: "GET",
      }),
      providesTags: ["Notifications"],
      transformResponse: (response) => {
        console.log("Raw notification response:", response); // Debug log
        return response;
      },
    }),
    getUnreadCount: build.query({
      query: (userId) => `notifications/${userId}/unread-count`,
      providesTags: ["Notifications"],
    }),
    createNotification: build.mutation({
      query: (data) => ({
        url: "notifications",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    }),
    createBulkNotifications: build.mutation({
      query: (data) => ({
        url: 'notifications/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications'],
    }),
    markNotificationAsRead: build.mutation({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllNotificationsAsRead: build.mutation({
      query: (userId) => ({
        url: `notifications/${userId}/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    deleteNotification: build.mutation({
      query: (id) => ({
        url: `notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
    clearAllNotifications: build.mutation({
      query: (userId) => ({
        url: `notifications/${userId}/clear-all`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useUpdateUserMutation,
  useUploadPhotoMutation,
  useGetUserNotificationsQuery,
  useGetUnreadCountQuery,
  useCreateNotificationMutation,
  useCreateBulkNotificationsMutation,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
} = api;
