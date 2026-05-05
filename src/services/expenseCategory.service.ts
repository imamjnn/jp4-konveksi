import api from "@/lib/axios";
import { DefaultResponse } from "@/types";
import {
  CategoryExpensesResponse,
  CreateCategoryExpensePayload,
} from "@/types/expenseCateogry.types";
import axios from "axios";

export const getCategoryExpenses = async () => {
  try {
    const response =
      await api.get<CategoryExpensesResponse>(`/expense-categories`);
    if (response) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching:", error);
    return null;
  }
};

export const createCategoryExpense = async (
  params: CreateCategoryExpensePayload,
) => {
  try {
    const response = await api.post<DefaultResponse>(
      `/expense-categories`,
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

export const updateCategoryExpense = async (
  params: CreateCategoryExpensePayload,
) => {
  try {
    const response = await api.put<DefaultResponse>(
      `/expense-categories/${params.id}`,
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

export const deleteCategoryExpense = async (id: number = 1) => {
  try {
    const response = await api.delete<DefaultResponse>(
      `/expense-categories/${id}`,
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
