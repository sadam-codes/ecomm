import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/products",
});

export const getProducts = async () => {
  const { data } = await API.get("");
  return data;
};

export const getProduct = async (id: number) => {
  const { data } = await API.get(`/${id}`);
  return data;
};

export const getByCategory = async (category: string) => {
  const { data } = await API.get(`/category/${category}`);
  return data;
};

export const createProduct = async (product: any) => {
  const { data } = await API.post("/", product);
  return data;
};

export const updateProduct = async (id: number, product: any) => {
  const { data } = await API.put(`/${id}`, product);
  return data;
};

export const deleteProduct = async (id: number) => {
  await API.delete(`/${id}`);
};
