import { ResponseAPI } from ".";

export type SummaryData = {
  period: string;
  dateFrom: string;
  dateTo: string;
  vouchers: {
    total: number;
    totalQty: number;
    totalAmount: number;
    byStatus: {
      status: string;
      total: number;
      totalQty: number;
      totalAmount: number;
    }[];
  };
  revenue: {
    total: number;
    totalTransactions: number;
  };
  expenses: {
    total: number;
    totalTransactions: number;
    byCategory: {
      categoryId: number;
      categoryName: string;
      totalAmount: number;
      totalTransactions: number;
    }[];
  };
  netProfit: number;
  members: {
    total: number;
  };
  items: {
    total: number;
  };
  production: {
    itemId: number;
    itemName: string;
    unit: string;
    totalQty: number;
    totalRejected: number;
    totalSubtotal: number;
  }[];
};

export interface SummaryResults {
  success: boolean;
  message: string;
  data: SummaryData;
}

export type SummaryResponse = ResponseAPI<SummaryResults>;
