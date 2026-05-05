import { useState } from "react";
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
import { updateItem } from "@/services/item.service";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  onClose: () => void;
  itemId: number;
};

export default function UpdateRate({ open, setOpen, onClose, itemId }: Props) {
  const [rate, setRate] = useState(0);

  const resetForm = () => {
    setRate(0);
  };

  const mutation = useMutation({
    mutationFn: updateItem,
  });
  const handleSubmit = async () => {
    const payload = { rate, id: itemId };
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
            <DialogTitle>Update Harga</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label>Harga/Ongkos</Label>
              <Input
                name="rate"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                type="number"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={mutation.isPending}>
              {mutation.isPending && <Spinner />} Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
