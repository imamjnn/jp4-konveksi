/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const authLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        email,
        password,
      },
    );

    if (response?.data?.success) {
      const { accessToken, refreshToken } = response.data.data;

      // simpan ke cookies
      Cookies.set("accessToken", accessToken, {
        expires: 1, // 1 hari
        secure: true,
        sameSite: "none",
      });

      Cookies.set("refreshToken", refreshToken, {
        expires: 7, // 7 hari
        secure: true,
        sameSite: "none",
      });

      return response.data;
    }

    return null;
  } catch (err: any) {
    console.log(err.response?.data.message || "Login gagal");
    toast.error(err.response?.data.message || "Login gagal");
    return null;
  }
};
