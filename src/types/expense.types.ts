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
  message: string;
  data: ExpensesData[];
  totalAmount: number;
  totalTransactions: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type ExpensesResponse = ResponseAPI<ExpensesResults>;

type DetailExpenseData = {
  id: number;
  description: string;
  totalAmount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  };
  createdBy: {
    id: number;
    name: string;
  };
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
  message: string;
  data: DetailExpenseData;
}

export type DetailExpensesResponse = ResponseAPI<DetailExpensesResults>;

export interface SummaryExpensesResults {
  success: boolean;
  message: string;
  data: {
    period: string;
    dateFrom: string;
    dateTo: string;
    totalAmount: number;
    totalTransactions: number;
    byCategory: [
      {
        categoryId: number;
        categoryName: string;
        totalAmount: string;
        totalTransactions: number;
      },
      {
        categoryId: number;
        categoryName: string;
        totalAmount: string;
        totalTransactions: number;
      },
    ];
  };
}

export type SummaryExpensesResponse = ResponseAPI<SummaryExpensesResults>;
