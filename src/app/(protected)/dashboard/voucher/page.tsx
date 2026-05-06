"use client";

import { TablePagination } from "@/components/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateVoucher } from "@/components/voucher/create-voucher";
import DetailVoucher from "@/components/voucher/detail-voucher";
import { formatRupiah } from "@/lib/formatter";
import { deleteVoucher, getVouchers } from "@/services/voucher.service";
import { IconEye, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function VoucherPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [voucherId, setVoucherId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (search.length > 2) {
      const timer = setTimeout(() => {
        setDebouncedSearch(search);
        setPage(1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [search]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["vouchers", debouncedSearch, status, page],
    queryFn: () => getVouchers(debouncedSearch, status, "", page),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVoucher,

    onSuccess: (e) => {
      if (e?.success) {
        toast.success("Berhasil dihapus");
        refetch();
      } else {
        toast.error(e?.message || "Gagal menghapus voucher.");
      }
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Yakin mau hapus?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 px-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4">
          <Input
            placeholder="Cari code vocher"
            className="max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => {
              setVoucherId(undefined);
              setOpen(true);
            }}
          >
            + Buat Voucher Baru
          </Button>
        </div>{" "}
        <div className="flex gap-2">
          {[
            { label: "Semua", value: "" },
            { label: "On Process", value: "on_process" },
            { label: "Paid", value: "paid" },
            { label: "Claimed", value: "claimed" },
          ].map((s) => (
            <Button
              key={s.value}
              size="sm"
              variant={status === s.value ? "default" : "outline"}
              onClick={() => {
                setStatus(s.value);
                setPage(1);
              }}
            >
              {s.label}
            </Button>
          ))}
        </div>{" "}
        {isFetching ? (
          <div className="flex items-center justify-center h-48">
            <Spinner />
          </div>
        ) : data ? (
          <>
            <Card className="w-full p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-60">Kode Voucher</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Qty</TableHead>
                    <TableHead>Total Ongkos</TableHead>
                    <TableHead className="text-right w-60">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.memberName}</TableCell>
                      <TableCell>
                        {item.status === "claimed" ? (
                          <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                            {item.status}
                          </Badge>
                        ) : item.status === "on_process" ? (
                          <Badge className="bg-orange-50 text-orange-700 dark:bg-red-950 dark:text-red-300">
                            {item.status}
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-50 text-blue-700 dark:bg-red-950 dark:text-red-300">
                            {item.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.totalQty}</TableCell>
                      <TableCell>Rp {formatRupiah(item.totalAmount)}</TableCell>
                      <TableCell className="text-right gap-2 flex justify-end">
                        {item.status === "on_process" && (
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <IconTrash />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setOpenDetail(true);
                            setVoucherId(item.id);
                          }}
                        >
                          <IconEye />
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
            <CreateVoucher
              open={open}
              setOpen={setOpen}
              onClose={() => {
                refetch();
                setVoucherId(undefined);
              }}
            />
            <DetailVoucher
              open={openDetail}
              setOpen={setOpenDetail}
              onClose={() => {
                refetch();
                setVoucherId(undefined);
              }}
              voucherId={voucherId!}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-48">
            Tidak ada data
          </div>
        )}
      </div>
    </div>
  );
}
