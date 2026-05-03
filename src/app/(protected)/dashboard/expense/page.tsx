"use client";

import { AddExpense } from "@/components/expense/add-expense";
import TableExpense from "@/components/expense/table-expense";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getExpenses } from "@/services/expense.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function ExpensePage() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4">
      <TableExpense />
    </div>
  );
}

export default ExpensePage;
