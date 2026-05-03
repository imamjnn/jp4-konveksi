import { z } from "zod";

export const expenseDetailSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  qty: z.number().min(1, "Qty minimal 1"),
  price: z.number().min(0, "Harga tidak boleh negatif"),
});

export const createExpenseSchema = z.object({
  categoryId: z.number(),
  description: z.string().optional(),
  date: z.string().optional(),
  details: z.array(expenseDetailSchema).min(1, "Minimal 1 item"),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
