"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconPencil, IconTrash, IconX, IconCheck } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  getCategoryExpenses,
  createCategoryExpense,
  updateCategoryExpense,
  deleteCategoryExpense,
} from "@/services/expenseCategory.service";

type CategoryItem = {
  id: number;
  name: string;
};

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

export function ManageCategory({ open, setOpen }: Props) {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: getCategoryExpenses,
    enabled: open,
  });

  const categories: CategoryItem[] = data?.data ?? [];

  const createMutation = useMutation({
    mutationFn: createCategoryExpense,
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Kategori ditambahkan");
        setNewName("");
        queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
      } else {
        toast.error(res?.message ?? "Gagal menambahkan");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategoryExpense,
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Kategori diperbarui");
        setEditingId(null);
        queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
      } else {
        toast.error(res?.message ?? "Gagal memperbarui");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryExpense,
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Kategori dihapus");
        queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
      } else {
        toast.error(res?.message ?? "Gagal menghapus");
      }
    },
  });

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    createMutation.mutate({ name });
  };

  const startEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdate = () => {
    const name = editingName.trim();
    if (!name || editingId === null) return;
    updateMutation.mutate({ id: editingId, name });
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin mau hapus kategori ini?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Kelola Kategori</DialogTitle>
        </DialogHeader>

        {/* Form tambah */}
        <div className="flex gap-2">
          <Input
            placeholder="Nama kategori baru"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? <Spinner /> : "Tambah"}
          </Button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
          {isFetching ? (
            <div className="flex justify-center py-6">
              <Spinner className="size-5" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Belum ada kategori
            </p>
          ) : (
            categories.map((cat: CategoryItem) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 rounded-md border px-3 py-2"
              >
                {editingId === cat.id ? (
                  <>
                    <Input
                      className="h-7 flex-1"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 text-green-600"
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        <Spinner />
                      ) : (
                        <IconCheck size={16} />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      onClick={() => setEditingId(null)}
                    >
                      <IconX size={16} />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm">{cat.name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      onClick={() => startEdit(cat.id, cat.name)}
                    >
                      <IconPencil size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 text-red-500"
                      onClick={() => handleDelete(cat.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageCategory;
