import api from "@/lib/axios";
import { DefaultResponse } from "@/types";
import { CreateMemberPayload, MembersResponse } from "@/types/member.types";
import axios from "axios";

export const getMembers = async (search: string = "", page: number = 1) => {
  try {
    const response = await api.get<MembersResponse>(
      `/members?search=${search}&page=${page}&limit=10`,
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

export const createMember = async (params: CreateMemberPayload) => {
  try {
    const response = await api.post<DefaultResponse>(`/members`, params);
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

export const updateMember = async (params: CreateMemberPayload) => {
  try {
    const response = await api.put<DefaultResponse>(
      `/members/${params.id}`,
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

export const deleteMember = async (id: number) => {
  try {
    const response = await api.delete<DefaultResponse>(`/members/${id}`);
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
