import { db } from "@/db";
import { expenses, expenseDetails } from "@/db/schema";
import { ExpenseDetailPayload } from "@/types/expense.types";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const expenseId = Number(id);

  try {
    const expense = await db.query.expenses.findFirst({
      where: eq(expenses.id, expenseId),
    });

    const details = await db.query.expenseDetails.findMany({
      where: eq(expenseDetails.expenseId, expenseId),
    });

    const data = { ...expense, details };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch detail" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const expenseId = Number(id);

  try {
    // hapus detail dulu
    await db
      .delete(expenseDetails)
      .where(eq(expenseDetails.expenseId, expenseId));

    // hapus header
    await db.delete(expenses).where(eq(expenses.id, expenseId));

    return NextResponse.json({ success: true, message: "Expense deleted" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const expenseId = Number(id);

  try {
    const body = await req.json();

    const { categoryId, description, date, details = [] } = body;

    // validasi basic
    if (!categoryId || !Array.isArray(details)) {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 },
      );
    }

    // hitung total
    const totalAmount = details.reduce(
      (acc: number, item: ExpenseDetailPayload) => acc + item.qty * item.price,
      0,
    );

    // update header
    await db
      .update(expenses)
      .set({
        categoryId,
        description,
        totalAmount,
        date: date ? new Date(date) : new Date(),
        updatedAt: new Date(),
      })
      .where(eq(expenses.id, expenseId));

    // 🔥 hapus detail lama
    await db
      .delete(expenseDetails)
      .where(eq(expenseDetails.expenseId, expenseId));

    // 🔥 insert ulang detail
    if (details.length > 0) {
      await db.insert(expenseDetails).values(
        details.map((item: ExpenseDetailPayload) => ({
          expenseId,
          name: item.name,
          qty: item.qty,
          price: item.price,
          subtotal: item.qty * item.price,
        })),
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense updated",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 500 },
    );
  }
}
