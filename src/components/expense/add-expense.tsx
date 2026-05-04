/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCallback, useEffect, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { Card, CardContent } from "../ui/card";
import { DatePicker } from "../date-picker";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import {
  createExpense,
  deleteExpense,
  getDetailExpense,
  updateExpense,
} from "@/services/expense.service";
import { formatRupiah, parseNumber } from "@/lib/formatter";

interface DetailItem {
  name: string;
  qty: number;
  price: number;
}

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  onClose: () => void;
  expenseId?: number;
};

export function AddExpense({ open, setOpen, onClose, expenseId }: Props) {
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [categoryId, setCategoryId] = useState(1);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [details, setDetails] = useState<DetailItem[]>([
    { name: "", qty: 1, price: 0 },
  ]);

  const resetForm = () => {
    setCategoryId(1);
    setDescription("");
    setDate(new Date());
    setDetails([{ name: "", qty: 1, price: 0 }]);
  };

  const loadDetail = useCallback(async () => {
    if (!expenseId) return;

    try {
      setLoadingDetail(true);

      const response = await getDetailExpense(expenseId);

      if (response?.success && response.data) {
        const expense = response.data;

        setCategoryId(expense.category.id);
        setDescription(expense.description || "");
        setDate(new Date(expense.date));

        setDetails(
          expense.details.map((item: any) => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
          })),
        );
      } else {
        toast.error("Gagal memuat detail");
        setOpen(false);
      }
    } finally {
      setLoadingDetail(false);
    }
  }, [expenseId, setOpen]);

  useEffect(() => {
    if (open && expenseId) {
      loadDetail();
    }
  }, [open, expenseId, loadDetail]);

  // hitung total
  const total = details.reduce((acc, item) => acc + item.qty * item.price, 0);

  const addRow = () => {
    setDetails([...details, { name: "", qty: 1, price: 0 }]);
  };

  const removeRow = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof DetailItem, value: any) => {
    const newDetails = [...details];
    // @ts-expect-error
    newDetails[index][field] = value as DetailItem[keyof DetailItem];
    setDetails(newDetails);
  };

  const mutation = useMutation({
    mutationFn: expenseId ? updateExpense : createExpense,
  });
  const handleSubmit = async () => {
    const payload = {
      categoryId,
      description,
      date: date.toISOString(),
      details,
    };
    const response = await mutation.mutateAsync(
      expenseId ? { ...payload, id: expenseId } : payload,
    );
    if (response && response.success) {
      toast.success(expenseId ? "Berhasil diupdate" : "Berhasil disimpan");
      resetForm();
      setOpen(false);
      onClose(); // panggil callback untuk refresh data
    } else {
      toast.error(response.message || "Gagal menyimpan pengeluaran.");
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,

    onSuccess: () => {
      toast.success("Berhasil dihapus");
      setOpen(false);
      onClose();
    },
  });

  const handleDelete = () => {
    if (confirm("Yakin mau hapus?")) {
      deleteMutation.mutate(expenseId);
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
            <DialogTitle>{expenseId ? "" : "Tambah "}Pengeluaran</DialogTitle>
          </DialogHeader>
          {loadingDetail && expenseId ? (
            <div className="flex justify-center items-center py-12">
              <Spinner className="size-6" />
            </div>
          ) : (
            <FieldGroup className="no-scrollbar max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-center gap-4">
                <Field>
                  <Label>Kategori</Label>
                  <Select
                    value={String(categoryId)}
                    onValueChange={(e) => setCategoryId(Number(e))}
                  >
                    <SelectTrigger className="w-full max-w-lg">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Kategori</SelectLabel>
                        <SelectItem value="1">Bahan</SelectItem>
                        <SelectItem value="2">Jasa</SelectItem>
                        <SelectItem value="3">Operasional</SelectItem>
                        <SelectItem value="4">Lain - lain</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="max-w-50">
                  <Label>Tanggal</Label>
                  <DatePicker defaultDate={date} onDateChange={setDate} />
                </Field>
              </div>
              <Field>
                <Label>Deskripsi</Label>
                <Input
                  name="name"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>

              {/* Detail */}
              <div>
                <h2 className="font-medium mb-2">Detail</h2>
                <div className="flex flex-col gap-2">
                  {details.map((item, index) => (
                    <Card key={index} className="m-0.5">
                      <CardContent className="flex flex-col gap-2">
                        <Input
                          placeholder="Nama"
                          value={item.name}
                          className="min-w-60"
                          onChange={(e) =>
                            updateItem(index, "name", e.target.value)
                          }
                        />
                        <div className="flex gap-4 items-center">
                          <div className="flex items-center gap-2">
                            <p>Qty:</p>
                            <Input
                              type="number"
                              value={item.qty}
                              className="max-w-30"
                              onChange={(e) =>
                                updateItem(index, "qty", Number(e.target.value))
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <p>Jumlah:</p>
                            <Input
                              value={formatRupiah(item.price)}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "price",
                                  parseNumber(e.target.value),
                                )
                              }
                            />
                          </div>

                          <div className="text-right pr-2">
                            {formatRupiah(item.qty * item.price)}
                          </div>

                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeRow(index)}
                              className="text-red-500"
                            >
                              <IconX />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={addRow}>
                    + Tambah Item
                  </Button>
                  <p>{formatRupiah(total)}</p>
                </div>
              </div>
            </FieldGroup>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            {expenseId && (
              <Button variant="destructive" onClick={handleDelete}>
                Hapus
              </Button>
            )}
            <Button onClick={handleSubmit} disabled={mutation.isPending}>
              {mutation.isPending && <Spinner />}{" "}
              {expenseId ? "Update" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
