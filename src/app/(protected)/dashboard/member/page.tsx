"use client";

import AddMember from "@/components/member/add-member";
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
import { getMembers } from "@/services/member.service";
import { MemberData } from "@/types/member.types";
import { IconEdit } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function MemberPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [memberId, setMemberId] = useState<number | undefined>(undefined);
  const [memberDetail, setMemberDetail] = useState<MemberData | undefined>(
    undefined,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["expenses", debouncedSearch, page],
    queryFn: () => getMembers(debouncedSearch, page),
  });

  return (
    <div className="grid grid-cols-1 gap-4 px-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4">
          <Input
            placeholder="Cari nama member"
            className="max-w-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => {
              setMemberId(undefined);
              setOpen(true);
            }}
          >
            + Tambah Member
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
                    <TableHead className="w-60">Phone</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.address}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setOpen(true);
                            setMemberId(item.id);
                            setMemberDetail(item);
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
            <AddMember
              open={open}
              setOpen={setOpen}
              onClose={() => {
                refetch();
                setMemberId(undefined);
                setMemberDetail(undefined);
              }}
              memberId={memberId}
              memberDetail={memberDetail}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
