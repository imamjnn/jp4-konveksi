import api from "@/lib/axios";
import { SummaryResponse } from "@/types/summary.types";

export const getSummary = async (period?: string) => {
  try {
    const response = await api.get<SummaryResponse>(
      `/report/summary${period ? `?period=${period}` : ""}`,
    );
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Unknown Error:", error);
    return null;
  }
};
