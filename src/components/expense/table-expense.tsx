import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatRupiah } from "@/lib/formatter";
import dayjs from "dayjs";
import { TablePagination } from "../table-pagination";
import { Button } from "../ui/button";
import { IconEyeEdit } from "@tabler/icons-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "@/services/expense.service";
import { Spinner } from "../ui/spinner";
import { AddExpense } from "./add-expense";
import { RangeDatePicker } from "../range-date-picker";
import { DateRange } from "react-day-picker";

function TableExpense() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [expenseId, setExpenseId] = useState<number | undefined>(undefined);
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["expenses", page, range],
    queryFn: () =>
      getExpenses(
        page,
        range?.from ? dayjs(range.from).format("YYYY-MM-DD") : undefined,
        range?.to ? dayjs(range.to).format("YYYY-MM-DD") : undefined,
      ),
  });

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {data ? (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <RangeDatePicker value={range} onChange={setRange} />
            <Button
              variant="outline"
              onClick={() => {
                setExpenseId(undefined);
                setOpen(true);
              }}
            >
              + Tambah Pengeluaran
            </Button>
          </div>
          <Card className="w-full p-4">
            <Table>
              <TableCaption>
                Total Pengeluaran: Rp{formatRupiah(data.totalAmount)} | Jumlah
                Items: {data.totalTransactions}.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-35">Tanggal</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                      {dayjs(expense.date).format("DD MMM YYYY")}
                    </TableCell>
                    <TableCell>{expense.category.name}</TableCell>
                    <TableCell>
                      {expense.description ? expense.description : "-"}
                    </TableCell>
                    <TableCell>Rp{formatRupiah(expense.totalAmount)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setOpen(true);
                          setExpenseId(expense.id);
                        }}
                      >
                        <IconEyeEdit />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <TablePagination
            page={data?.pagination.page}
            totalPages={data?.pagination.totalPages}
            onChange={setPage}
          />
          <AddExpense
            open={open}
            setOpen={setOpen}
            onClose={() => {
              refetch();
              setExpenseId(undefined);
            }}
            expenseId={expenseId}
          />
        </div>
      ) : null}
    </>
  );
}

export default TableExpense;
