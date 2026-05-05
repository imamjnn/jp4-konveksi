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
import {
  createMember,
  deleteMember,
  updateMember,
} from "@/services/member.service";
import { toast } from "sonner";
import { MemberData } from "@/types/member.types";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  onClose: () => void;
  memberId?: number;
  memberDetail?: MemberData;
};

export default function AddMember({
  open,
  setOpen,
  onClose,
  memberId,
  memberDetail,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const resetForm = () => {
    setName("");
    setPhone("");
    setAddress("");
  };

  useEffect(() => {
    if (open && memberId) {
      setName(memberDetail?.name || "");
      setPhone(memberDetail?.phone || "");
      setAddress(memberDetail?.address || "");
    }
  }, [open, memberId, memberDetail]);

  const mutation = useMutation({
    mutationFn: memberId ? updateMember : createMember,
  });
  const handleSubmit = async () => {
    const payload = {
      name,
      phone,
      address,
    };
    const response = await mutation.mutateAsync(
      memberId ? { ...payload, id: memberId } : payload,
    );
    if (response && response.success) {
      toast.success(memberId ? "Berhasil diupdate" : "Berhasil disimpan");
      resetForm();
      setOpen(false);
      onClose(); // panggil callback untuk refresh data
    } else {
      toast.error(response.message || "Gagal menyimpan pengeluaran.");
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deleteMember,

    onSuccess: (e) => {
      if (e?.success) {
        toast.success("Berhasil dihapus");
        setOpen(false);
        onClose();
      } else {
        toast.error(e?.message || "Gagal menghapus member.");
      }
    },
  });

  const handleDelete = () => {
    if (confirm("Yakin mau hapus?")) {
      deleteMutation.mutate(memberId!);
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
            <DialogTitle>{memberId ? "Update " : "Tambah "}Member</DialogTitle>
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
              <Label>Phone</Label>
              <Input
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            <Field>
              <Label>Alamat</Label>
              <Input
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            {memberId && (
              <Button variant="destructive" onClick={handleDelete}>
                Hapus
              </Button>
            )}
            <Button onClick={handleSubmit} disabled={mutation.isPending}>
              {mutation.isPending && <Spinner />}{" "}
              {memberId ? "Update" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
