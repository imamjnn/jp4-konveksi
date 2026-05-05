import { ResponseAPI } from ".";

export interface CreateCategoryExpensePayload {
  id?: number; // optional untuk update
  name: string;
}

type CategoryExpenseData = {
  id: number;
  name: string;
};

export interface CategoryExpensesResults {
  success: boolean;
  message: string;
  data: CategoryExpenseData[];
}

export type CategoryExpensesResponse = ResponseAPI<CategoryExpensesResults>;
