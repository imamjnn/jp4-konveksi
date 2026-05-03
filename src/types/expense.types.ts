import { ResponseAPI } from ".";

export interface ExpenseDetailPayload {
  name: string;
  qty: number;
  price: number;
}

export interface CreateExpensePayload {
  id?: number; // optional untuk update
  categoryId: number;
  description?: string;
  date?: string; // ISO string dari frontend
  details: ExpenseDetailPayload[];
}

export type ExpensesData = {
  id: number;
  category: {
    id: number;
    name: string;
  };
  description: string;
  totalAmount: number;
  date: string;
  createdAt: string;
};

export interface ExpensesResults {
  success: boolean;
  data: ExpensesData[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ExpensesResponse = ResponseAPI<ExpensesResults>;

type DetailExpenseData = {
  id: number;
  categoryId: number;
  description: string;
  totalAmount: number;
  createdBy: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  details: {
    id: number;
    expenseId: number;
    name: string;
    qty: number;
    price: number;
    subtotal: number;
  }[];
};

export interface DetailExpensesResults {
  success: boolean;
  data: DetailExpenseData;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type DetailExpensesResponse = ResponseAPI<DetailExpensesResults>;
