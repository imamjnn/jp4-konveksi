"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getSummaryExpense } from "@/services/expense.service";
import { formatRupiah } from "@/lib/formatter";
import { getSummary } from "@/services/summary.service";
import { da } from "date-fns/locale";

export function SectionCards() {
  const { data, isFetching } = useQuery({
    queryKey: ["summary"],
    queryFn: () => getSummary(),
  });

  return (
    <>
      {isFetching ? (
        <div className="flex h-24 items-center justify-center">
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Item/Produk</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {data.data.items.total}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Item yang diproduksi {data.data.production.length}{" "}
                <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Total item yang diproduksi selama ini
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Member</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {data.data.members.total}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Jumlah member aktif <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Total jumlah member yang terdaftar
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Voucher di claim</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                Rp{formatRupiah(data.data.vouchers.totalAmount)}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Jumlah voucher {data.data.vouchers.total}{" "}
                <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Total Qty {data.data.vouchers.totalQty}
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Pengeluaran</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                Rp{formatRupiah(data.data.expenses.total || 0)}
              </CardTitle>
              <CardAction></CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Jumlah items {data.data.expenses.totalTransactions}{" "}
                <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Total pengeluaran selama ini
              </div>
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </>
  );
}
