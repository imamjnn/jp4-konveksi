"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconX } from "@tabler/icons-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import SelectMember from "./select-member";
import { createVoucher } from "@/services/voucher.service";
import SelectItem from "./select-item";

type DetailItem = {
  itemId: number;
  itemName: string;
  qty: number;
  stock: number;
};

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  onClose: () => void;
};

export function CreateVoucher({ open, setOpen, onClose }: Props) {
  const [member, setMember] = useState<{ id: number; name: string } | null>(
    null,
  );
  const [details, setDetails] = useState<DetailItem[]>([
    { itemId: 0, itemName: "", qty: 1, stock: 0 },
  ]);

  const resetForm = () => {
    setMember(null);
    setDetails([{ itemId: 0, itemName: "", qty: 1, stock: 0 }]);
  };

  const addRow = () => {
    setDetails([...details, { itemId: 0, itemName: "", qty: 1, stock: 0 }]);
  };

  const removeRow = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    item: { id: number; name: string; currentStock: number },
  ) => {
    const updated = [...details];
    updated[index].itemId = item.id;
    updated[index].itemName = item.name;
    updated[index].stock = item.currentStock;
    setDetails(updated);
  };

  const updateQty = (index: number, qty: number) => {
    const updated = [...details];
    updated[index].qty = qty;
    setDetails(updated);
  };

  const mutation = useMutation({
    mutationFn: createVoucher,
  });

  const handleSubmit = async () => {
    if (!member) {
      toast.error("Pilih member terlebih dahulu");
      return;
    }

    const invalidRow = details.find((d) => d.itemId === 0);
    if (invalidRow) {
      toast.error("Semua item harus dipilih");
      return;
    }

    const overStock = details.find((d) => d.qty > d.stock);
    if (overStock) {
      toast.error(
        `Qty "${overStock.itemName}" melebihi stok (${overStock.stock})`,
      );
      return;
    }

    const response = await mutation.mutateAsync({
      memberId: member.id,
      details: details.map(({ itemId, qty }) => ({ itemId, qty })),
    });

    if (response?.success) {
      toast.success("Voucher berhasil dibuat");
      resetForm();
      setOpen(false);
      onClose();
    } else {
      toast.error(response?.message ?? "Gagal membuat voucher");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogContent
        className="sm:max-w-2xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Buat Voucher</DialogTitle>
        </DialogHeader>

        <FieldGroup className="no-scrollbar max-h-[70vh] overflow-y-auto">
          {/* Member */}
          <Field>
            <Label>Member</Label>
            <SelectMember onSelect={setMember} selected={member} />
          </Field>

          {/* Detail items */}
          <div>
            <h2 className="font-medium mb-2">Item</h2>
            <div className="flex flex-col gap-2">
              {details.map((row, index) => (
                <Card key={index} className="m-0.5">
                  <CardContent className="flex items-start gap-3">
                    <div className="flex-1">
                      <SelectItem
                        onSelect={(item) => updateItem(index, item)}
                        selected={
                          row.itemId
                            ? { id: row.itemId, name: row.itemName }
                            : null
                        }
                      />
                      {row.itemId > 0 && (
                        <p
                          className={`text-xs mt-1 ${
                            row.stock === 0
                              ? "text-red-500"
                              : row.stock <= 5
                                ? "text-yellow-500"
                                : "text-muted-foreground"
                          }`}
                        >
                          Stok tersedia: {row.stock}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">Qty:</p>
                      <Input
                        type="number"
                        min={1}
                        max={row.stock || undefined}
                        value={row.qty}
                        className="w-20"
                        onChange={(e) =>
                          updateQty(index, Number(e.target.value))
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 shrink-0"
                      onClick={() => removeRow(index)}
                      disabled={details.length === 1}
                    >
                      <IconX />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="ghost" className="mt-1" onClick={addRow}>
              + Tambah Item
            </Button>
          </div>
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending && <Spinner />} Buat Voucher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
