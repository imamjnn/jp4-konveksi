import { ResponseAPI } from ".";

export type CreateVoucherPayload = {
  memberId: number;
  details: {
    itemId: number;
    qty: number;
  }[];
};

export type VoucherData = {
  id: number;
  memberId: number;
  memberName: string;
  code: string;
  status: string;
  totalQty: number;
  totalAmount: number;
  createdAt: string;
  completedAt: string;
};

export interface VouchersResults {
  success: boolean;
  message: string;
  data: VoucherData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type VouchersResponse = ResponseAPI<VouchersResults>;

export type DetailVoucherData = {
  id: number;
  code: string;
  memberId: number;
  memberName: string;
  status: string;
  totalQty: number;
  totalAmount: number;
  createdAt: string;
  completedAt: string;
  details: [
    {
      id: number;
      itemId: number;
      itemName: string;
      unit: string;
      qty: number;
      rate: number;
      subtotal: number;
      rejectedQty: number;
      rejectNote: string;
    },
  ];
  payout: string;
};

export interface DetailVoucherResults {
  success: boolean;
  message: string;
  data: DetailVoucherData;
}

export type DetailVoucherResponse = ResponseAPI<DetailVoucherResults>;

export type ClaimVoucherRejection = {
  voucherDetailId: number;
  rejectedQty: number;
  rejectNote: string;
};

export type ClaimVoucherPayload =
  | Record<string, never>
  | { rejections: ClaimVoucherRejection[] };
