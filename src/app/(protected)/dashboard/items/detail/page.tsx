"use client";

import AddStock from "@/components/item/add-stock";
import UpdateRate from "@/components/item/update-rate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/formatter";
import { getDetailItem } from "@/services/item.service";
import { IconArrowLeft, IconEdit } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function ItemDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openRate, setOpenRate] = useState(false);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["item-detail", id],
    queryFn: () => getDetailItem(Number(id)),
  });

  return (
    <div className="grid grid-cols-1 gap-4 px-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 item-center">
          <Button variant="outline" onClick={() => router.back()}>
            <IconArrowLeft /> Kembali
          </Button>
          <h1 className="text-2xl font-bold mb-4">{data?.data.name}</h1>
        </div>
        {isFetching ? (
          <div className="flex items-center justify-center h-48">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <Card className="col-span-2">
              <CardContent>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold pb-2">
                    Stok: {formatRupiah(data?.data.currentStock || 0)}
                  </h2>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setOpen(true)}
                  >
                    <IconEdit />
                  </Button>
                </div>
                <Table>
                  <TableCaption>Riwayat stok.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-25">Stok</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead className="text-right">Tanggal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data.stockHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {formatRupiah(item.qty)}
                        </TableCell>
                        <TableCell className="font-light">
                          {item.note ? item.note : "-"}
                        </TableCell>
                        <TableCell className="font-light">
                          {item.type === "in" ? (
                            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                              Masuk
                            </Badge>
                          ) : (
                            <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                              Keluar
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-light">
                          {dayjs(item.createdAt).format("DD/MM/YYYY, HH:mm")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardContent>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold pb-2">
                    Harga/Ongkos: Rp
                    {formatRupiah(data?.data.rates[0].rate || 0)}
                  </h2>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setOpenRate(true)}
                  >
                    <IconEdit />
                  </Button>
                </div>
                <Table>
                  <TableCaption>Riwayat perubahan harga.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-25">Harga</TableHead>
                      <TableHead className="text-right">Tanggal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data.rates.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          Rp{formatRupiah(item.rate)}
                        </TableCell>
                        <TableCell className="text-right font-light">
                          {dayjs(item.createdAt).format("DD/MM/YYYY, HH:mm")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <AddStock
              itemId={Number(id)}
              onClose={() => {
                refetch();
              }}
              open={open}
              setOpen={setOpen}
            />
            <UpdateRate
              itemId={Number(id)}
              onClose={() => {
                refetch();
              }}
              open={openRate}
              setOpen={setOpenRate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
