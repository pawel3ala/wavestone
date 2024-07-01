import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      headers.set('Origin', 'test.com');
      headers.set('Referer', 'test.com');
      headers.set('Accept', 'application/json');
      headers.set('authorization', `Bearer dupa`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getProducts: builder.query({
      query: () => '/products',
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = appApi;