"use client";

import AddItem from "@/components/item/add-item";
import { TablePagination } from "@/components/table-pagination";
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
import { formatRupiah } from "@/lib/formatter";
import { getItems } from "@/services/item.service";
import { ItemData } from "@/types/item.types";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ItemsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState<number | undefined>(undefined);
  const [itemDetail, setItemDetail] = useState<ItemData | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["items", debouncedSearch, page],
    queryFn: () => getItems(debouncedSearch, page),
  });

  return (
    <div className="grid grid-cols-1 gap-4 px-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4">
          <Input
            placeholder="Cari nama item"
            className="max-w-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => {
              setItemId(undefined);
              setOpen(true);
            }}
          >
            + Tambah Item
          </Button>
        </div>
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
                    <TableHead>Nama</TableHead>
                    <TableHead className="w-60">Stok</TableHead>
                    <TableHead>Harga/Ongkos</TableHead>
                    <TableHead className="text-right w-60">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.currentStock}</TableCell>
                      <TableCell>Rp{formatRupiah(item.currentRate)}</TableCell>
                      <TableCell className="text-right gap-2 flex justify-end">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            router.push(`/dashboard/items/detail?id=${item.id}`)
                          }
                        >
                          <IconEye />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setOpen(true);
                            setItemId(item.id);
                            setItemDetail(item);
                          }}
                        >
                          <IconEdit />
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
            <AddItem
              open={open}
              setOpen={setOpen}
              onClose={() => {
                refetch();
                setItemId(undefined);
                setItemDetail(undefined);
              }}
              itemId={itemId}
              itemDetail={itemDetail}
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
