import api from "@/lib/axios";
import { DefaultResponse } from "@/types";
import {
  CreateItemPayload,
  DetailItemResponse,
  ItemsResponse,
  RestockItemPayload,
  UpdateItemPayload,
} from "@/types/item.types";
import axios from "axios";

export const getItems = async (search: string = "", page: number = 1) => {
  try {
    const response = await api.get<ItemsResponse>(
      `/items?search=${search}&page=${page}&limit=10`,
    );
    if (response) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching:", error);
    return null;
  }
};

export const getDetailItem = async (id: number) => {
  try {
    const response = await api.get<DetailItemResponse>(`/items/${id}`);
    if (response) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching:", error);
    return null;
  }
};

export const createItem = async (params: CreateItemPayload) => {
  try {
    const response = await api.post<DefaultResponse>(`/items`, params);
    if (response) {
      return response.data;
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("API Error:", error.response?.data);
      return error.response?.data;
    }

    console.log("Unknown Error:", error);
  }
};

export const restockItem = async (params: RestockItemPayload) => {
  try {
    const response = await api.post<DefaultResponse>(
      `/items/${params.id}/stock`,
      params,
    );
    if (response) {
      return response.data;
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("API Error:", error.response?.data);
      return error.response?.data;
    }

    console.log("Unknown Error:", error);
  }
};

export const updateItem = async (params: UpdateItemPayload) => {
  try {
    const response = await api.put<DefaultResponse>(
      `/items/${params.id}`,
      params,
    );
    if (response) {
      return response.data;
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("API Error:", error.response?.data);
      return error.response?.data;
    }

    console.log("Unknown Error:", error);
  }
};

export const deleteItem = async (id: number) => {
  try {
    const response = await api.delete<DefaultResponse>(`/items/${id}`);
    if (response) {
      return response.data;
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("API Error:", error.response?.data);
      return error.response?.data;
    }

    console.log("Unknown Error:", error);
  }
};
