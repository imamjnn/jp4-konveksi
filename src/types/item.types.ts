import { ResponseAPI } from ".";

export interface CreateItemPayload {
  id?: number; // optional untuk update
  name: string;
  unit: string;
  rate: number;
  stock: number;
  stockNote: string;
}

export interface RestockItemPayload {
  id: number; // optional untuk update
  qty: number;
  note?: string;
}

export interface UpdateItemPayload {
  id: number; // optional untuk update
  name?: string;
  unit?: string;
  rate?: number;
}

export type ItemData = {
  id: number;
  name: string;
  unit: string;
  createdAt: string;
  currentRate: number;
  currentStock: number;
};

export interface ItemsResults {
  success: boolean;
  message: string;
  data: ItemData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type ItemsResponse = ResponseAPI<ItemsResults>;

export type DetailItemData = {
  id: number;
  name: string;
  unit: string;
  createdAt: string;
  rates: {
    id: number;
    itemId: number;
    rate: number;
    createdAt: string;
  }[];
  currentStock: number;
  stockHistory: {
    id: number;
    itemId: number;
    type: string;
    qty: number;
    note: string;
    refType: string;
    refId: string;
    createdBy: number;
    createdAt: string;
  }[];
};

export interface DetailItemResults {
  success: boolean;
  message: string;
  data: DetailItemData;
}

export type DetailItemResponse = ResponseAPI<DetailItemResults>;
