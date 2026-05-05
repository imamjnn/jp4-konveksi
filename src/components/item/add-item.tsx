/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Spinner } from "../ui/spinner";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ItemData } from "@/types/item.types";
import { createItem, deleteItem, updateItem } from "@/services/item.service";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  onClose: () => void;
  itemId?: number;
  itemDetail?: ItemData;
};

export default function AddItem({
  open,
  setOpen,
  onClose,
  itemId,
  itemDetail,
}: Props) {
  const [name, setName] = useState("");
  const [rate, setRate] = useState(0);
  const [stock, setStock] = useState(0);

  const resetForm = () => {
    setName("");
    setRate(0);
  };

  useEffect(() => {
    if (open && itemId) {
      setName(itemDetail?.name || "");
      setRate(itemDetail?.currentRate || 0);
    }
  }, [open, itemId, itemDetail]);

  const mutation = useMutation({
    mutationFn: createItem,
  });
  const handleSubmit = async () => {
    const payload = {
      name,
      unit: "pcs",
      rate,
      stock,
      stockNote: "Stok awal",
    };
    const response = await mutation.mutateAsync(payload);
    if (response && response.success) {
      toast.success("Berhasil disimpan");
      resetForm();
      setOpen(false);
      onClose(); // panggil callback untuk refresh data
    } else {
      toast.error(response.message || "Gagal menyimpan items.");
    }
  };

  const mutationUpdate = useMutation({
    mutationFn: updateItem,
  });
  const handleUpdate = async () => {
    const payload = {
      id: itemId!,
      name,
    };
    const response = await mutationUpdate.mutateAsync(payload);
    if (response && response.success) {
      toast.success("Berhasil diupdate");
      resetForm();
      setOpen(false);
      onClose(); // panggil callback untuk refresh data
    } else {
      toast.error(response.message || "Gagal update items.");
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deleteItem,

    onSuccess: (e) => {
      if (e?.success) {
        toast.success("Berhasil dihapus");
        setOpen(false);
        onClose();
      } else {
        toast.error(e?.message || "Gagal menghapus item.");
      }
    },
  });

  const handleDelete = () => {
    if (confirm("Yakin mau hapus?")) {
      deleteMutation.mutate(itemId!);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetForm(); // ✅ reset saat close
        }
      }}
    >
      <form>
        <DialogContent
          className="sm:max-w-2xl"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{itemId ? "Update " : "Tambah "}Item</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label>Nama</Label>
              <Input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <Label>Harga</Label>
              <Input
                name="rate"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                readOnly={!!itemId}
                disabled={!!itemId}
                type="number"
              />
            </Field>
            {!itemId && (
              <Field>
                <Label>Stok</Label>
                <Input
                  name="stock"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  type="number"
                />
              </Field>
            )}
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            {itemId ? (
              <>
                <Button variant="destructive" onClick={handleDelete}>
                  Hapus
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={mutationUpdate.isPending}
                >
                  {mutationUpdate.isPending && <Spinner />} Update
                </Button>
              </>
            ) : (
              <Button onClick={handleSubmit} disabled={mutation.isPending}>
                {mutation.isPending && <Spinner />} Simpan
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
