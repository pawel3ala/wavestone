import { getStorageItemAsync } from "@/hooks/useStorageState";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;


export enum ProductCategory {
  ELECTRONICS = "Electronics",
  CLOTHING = "Clothing",
  FOOD = "Food",
}

export interface Product {
  id: number;
  name: string;
  price: number | string;
  category: ProductCategory;
  dateAdded: string;
}

interface Credentials {
  username: string;
  password: string;
}

interface RegisterResponse {
  // Define the shape of the response for register endpoint
}

interface LoginResponse {
  // Define the shape of the response for login endpoint
}


export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const token = await getStorageItemAsync("session");
      headers.set('Origin', 'test.com');
      headers.set('Referer', 'test.com');
      headers.set('Accept', 'application/json');
      headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, Credentials>({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation<LoginResponse, Credentials>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
    }),
    updateProduct: builder.mutation<Product, { id: number } & Partial<Product>>({
      query: ({ id, ...product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
    }),
    deleteProduct: builder.mutation<{ success: boolean }, number>({
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