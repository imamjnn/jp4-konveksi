import api from "@/lib/axios";
import { DefaultResponse } from "@/types";
import {
  CreateExpensePayload,
  DetailExpensesResponse,
  ExpensesResponse,
} from "@/types/expense.types";
import axios from "axios";

export const getExpenses = async (page: number = 1) => {
  try {
    const response = await api.get<ExpensesResponse>(
      `/api/expenses?page=${page}&limit=10`,
    );
    if (response) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return null;
  }
};

export const createExpense = async (params: CreateExpensePayload) => {
  try {
    const response = await api.post<DefaultResponse>(`/api/expenses`, params);
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

export const updateExpense = async (params: CreateExpensePayload) => {
  try {
    const response = await api.put<DefaultResponse>(
      `/api/expenses/${params.id}`,
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

export const deleteExpense = async (id: number = 1) => {
  try {
    const response = await api.delete<DefaultResponse>(`/api/expenses/${id}`);
    if (response) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching detail expenses:", error);
    return null;
  }
};

export const getDetailExpense = async (id: number = 1) => {
  try {
    const response = await api.get<DetailExpensesResponse>(
      `/api/expenses/${id}`,
    );
    if (response) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching detail expenses:", error);
    return null;
  }
};
