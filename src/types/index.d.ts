/* eslint-disable @typescript-eslint/no-explicit-any */
export type ResponseAPI<R = any> = Promise<R | null>;

export interface DefaultResults {
  success: boolean;
  message: string;
  status: number;
}

export type DefaultResponse = ResponseAPI<DefaultResults>;
