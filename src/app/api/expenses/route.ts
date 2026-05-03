/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { expenses, expenseDetails, expenseCategories } from "@/db/schema";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { getErrorMessage } from "@/lib/error";
import { createExpenseSchema } from "@/lib/validations/expense";
import { ExpenseDetailPayload } from "@/types/expense.types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const offset = (page - 1) * limit;

    // ambil data + join category
    const data = await db
      .select({
        id: expenses.id,
        description: expenses.description,
        totalAmount: expenses.totalAmount,
        date: expenses.date,
        createdAt: expenses.createdAt,

        category: {
          id: expenseCategories.id,
          name: expenseCategories.name,
        },
      })
      .from(expenses)
      .leftJoin(
        expenseCategories,
        eq(expenses.categoryId, expenseCategories.id),
      )
      .orderBy(desc(expenses.createdAt))
      .limit(limit)
      .offset(offset);

    // total count
    const total = await db.$count(expenses);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    const json = await req.json();

    // ✅ VALIDASI
    const body = createExpenseSchema.parse(json);

    const { categoryId, description, date, details = [] } = body;

    // hitung total dari detail
    const totalAmount = details.reduce(
      (acc: number, item: ExpenseDetailPayload) => acc + item.qty * item.price,
      0,
    );

    // insert header
    const [expense] = await db
      .insert(expenses)
      .values({
        categoryId,
        description,
        totalAmount,
        createdBy: session.userId,
        date: date ? new Date(date) : new Date(),
      })
      .returning();

    // insert details
    if (details.length > 0) {
      await db.insert(expenseDetails).values(
        details.map((item: ExpenseDetailPayload) => ({
          expenseId: expense.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          subtotal: item.qty * item.price,
        })),
      );
    }

    return NextResponse.json({ success: true, data: expense });
  } catch (err: unknown) {
    // ❗ handle Zod error
    if (err instanceof Error && "issues" in err) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: (err as any).issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: getErrorMessage(err) },
      { status: 500 },
    );
  }
}
