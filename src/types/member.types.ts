import { ResponseAPI } from ".";

export interface CreateMemberPayload {
  id?: number; // optional untuk update
  name: string;
  phone?: string;
  address?: string;
}

export type MemberData = {
  id: number;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
};

export interface MembersResults {
  success: boolean;
  message: string;
  data: MemberData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type MembersResponse = ResponseAPI<MembersResults>;
