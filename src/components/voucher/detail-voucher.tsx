"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { claimVoucher, getDetailVoucher } from "@/services/voucher.service";
import { formatRupiah } from "@/lib/formatter";
import type {
  ClaimVoucherRejection,
  DetailVoucherData,
} from "@/types/voucher.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner";

type RejectionInput = { rejectedQty: string; rejectNote: string };

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  onClose: () => void;
  voucherId: number;
};

export default function DetailVoucher({
  open,
  setOpen,
  onClose,
  voucherId,
}: Props) {
  const queryClient = useQueryClient();
  const [claimMode, setClaimMode] = useState(false);
  const [rejections, setRejections] = useState<Record<number, RejectionInput>>(
    {},
  );

  const { data, isFetching } = useQuery({
    queryKey: ["voucher-detail", voucherId],
    queryFn: () => getDetailVoucher(voucherId),
    enabled: open && !!voucherId,
  });

  const { mutate: submitClaim, isPending: isClaiming } = useMutation({
    mutationFn: (payload: Parameters<typeof claimVoucher>[1]) =>
      claimVoucher(voucherId, payload),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Voucher berhasil di-claim");
        queryClient.invalidateQueries({ queryKey: ["vouchers"] });
        queryClient.invalidateQueries({
          queryKey: ["voucher-detail", voucherId],
        });
        setClaimMode(false);
        setRejections({});
      } else {
        toast.error(res?.message ?? "Gagal claim voucher");
      }
    },
    onError: () => toast.error("Gagal claim voucher"),
  });

  const handleClaim = () => {
    const rejectList: ClaimVoucherRejection[] = Object.entries(rejections)
      .filter(([, v]) => Number(v.rejectedQty) > 0)
      .map(([id, v]) => ({
        voucherDetailId: Number(id),
        rejectedQty: Number(v.rejectedQty),
        rejectNote: v.rejectNote,
      }));

    submitClaim(rejectList.length > 0 ? { rejections: rejectList } : {});
  };

  const handleClose = () => {
    setClaimMode(false);
    setRejections({});
    onClose();
  };

  const voucher = data?.data;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent
        className="sm:max-w-4xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Detail Voucher</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center items-center py-12">
            <Spinner className="size-6" />
          </div>
        ) : voucher ? (
          <div className="flex flex-col gap-4">
            {/* Info header */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <div>
                <p className="text-muted-foreground">Kode</p>
                <p className="font-medium">{voucher.code}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                {voucher.status === "claimed" ? (
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                    {voucher.status}
                  </Badge>
                ) : voucher.status === "on_process" ? (
                  <Badge className="bg-orange-50 text-orange-700 dark:bg-red-950 dark:text-red-300">
                    {voucher.status}
                  </Badge>
                ) : (
                  <Badge className="bg-blue-50 text-blue-700 dark:bg-red-950 dark:text-red-300">
                    {voucher.status}
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-muted-foreground">Member</p>
                <p className="font-medium">{voucher.memberName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tanggal</p>
                <p className="font-medium">
                  {dayjs(voucher.createdAt).format("DD MMM YYYY")}
                </p>
              </div>
              {voucher.completedAt && (
                <div>
                  <p className="text-muted-foreground">Selesai</p>
                  <p className="font-medium">
                    {dayjs(voucher.completedAt).format("DD MMM YYYY")}
                  </p>
                </div>
              )}
              {voucher.payout && (
                <div>
                  <p className="text-muted-foreground">Payout</p>
                  <p className="font-medium">{voucher.payout}</p>
                </div>
              )}
            </div>

            {/* Detail items */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Reject</TableHead>
                  {claimMode && <TableHead>Catatan</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {voucher.details.map((d: DetailVoucherData["details"][0]) => (
                  <TableRow key={d.id}>
                    <TableCell>{d.itemName}</TableCell>
                    <TableCell>
                      {d.qty} {d.unit}
                    </TableCell>
                    <TableCell>Rp{formatRupiah(d.rate)}</TableCell>
                    <TableCell>Rp{formatRupiah(d.subtotal)}</TableCell>
                    <TableCell>
                      {claimMode ? (
                        <Input
                          type="number"
                          min={0}
                          max={d.qty}
                          className="w-20 h-8 text-sm"
                          value={rejections[d.id]?.rejectedQty ?? ""}
                          onChange={(e) =>
                            setRejections((prev) => ({
                              ...prev,
                              [d.id]: {
                                rejectedQty: e.target.value,
                                rejectNote: prev[d.id]?.rejectNote ?? "",
                              },
                            }))
                          }
                        />
                      ) : d.rejectedQty > 0 ? (
                        <span className="text-red-500" title={d.rejectNote}>
                          {d.rejectedQty}{" "}
                          {d.rejectNote ? `(${d.rejectNote})` : ""}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    {claimMode && (
                      <TableCell>
                        <Input
                          className="h-8 text-sm"
                          placeholder="Catatan reject..."
                          value={rejections[d.id]?.rejectNote ?? ""}
                          disabled={!Number(rejections[d.id]?.rejectedQty)}
                          onChange={(e) =>
                            setRejections((prev) => ({
                              ...prev,
                              [d.id]: {
                                rejectedQty: prev[d.id]?.rejectedQty ?? "0",
                                rejectNote: e.target.value,
                              },
                            }))
                          }
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Total */}
            <div className="flex justify-between items-center text-sm font-medium border-t pt-3">
              <span>Total Qty</span>
              <span>{voucher.totalQty}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span>Total Amount</span>
              <span>Rp{formatRupiah(voucher.totalAmount)}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            Data tidak ditemukan
          </p>
        )}

        <DialogFooter className="gap-2">
          {voucher?.status !== "claimed" && !isFetching && (
            <>
              {claimMode ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setClaimMode(false);
                      setRejections({});
                    }}
                    disabled={isClaiming}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleClaim} disabled={isClaiming}>
                    {isClaiming && <Spinner className="size-4 mr-2" />}
                    Konfirmasi Claim
                  </Button>
                </>
              ) : (
                <Button onClick={() => setClaimMode(true)}>
                  Claim Voucher
                </Button>
              )}
            </>
          )}
          {!claimMode && (
            <DialogClose asChild>
              <Button variant="outline">Tutup</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
