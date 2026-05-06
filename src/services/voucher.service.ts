import api from "@/lib/axios";
import { DefaultResponse } from "@/types";
import {
  ClaimVoucherPayload,
  CreateVoucherPayload,
  DetailVoucherResponse,
  VouchersResponse,
} from "@/types/voucher.types";
import axios from "axios";

export const getVouchers = async (
  code: string = "",
  status: string = "", // on_process, paid, claimed
  memberId: string = "",
  page: number = 1,
) => {
  try {
    const response = await api.get<VouchersResponse>(
      `/vouchers?code=${code}&status=${status}&memberId=${memberId}&page=${page}&limit=10`,
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

export const createVoucher = async (params: CreateVoucherPayload) => {
  try {
    const response = await api.post<DefaultResponse>(`/vouchers`, params);
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    console.error("Unknown Error:", error);
  }
};

export const getDetailVoucher = async (id: number) => {
  try {
    const response = await api.get<DetailVoucherResponse>(`/vouchers/${id}`);
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    console.error("Unknown Error:", error);
  }
};

export const claimVoucher = async (
  id: number,
  payload: ClaimVoucherPayload = {},
) => {
  try {
    const response = await api.put<DefaultResponse>(
      `/vouchers/${id}/claim`,
      payload,
    );
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    console.error("Unknown Error:", error);
  }
};

export const payVoucher = async (id: number) => {
  try {
    const response = await api.put<DefaultResponse>(`/vouchers/${id}/pay`);
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    console.error("Unknown Error:", error);
  }
};

export const deleteVoucher = async (id: number) => {
  try {
    const response = await api.delete<DefaultResponse>(`/vouchers/${id}`);
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
