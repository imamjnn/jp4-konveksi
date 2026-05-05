import { useQuery } from "@tanstack/react-query";
import { Field } from "../ui/field";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getCategoryExpenses } from "@/services/expenseCategory.service";
import { Spinner } from "../ui/spinner";
import { useState } from "react";
import { Button } from "../ui/button";
import ManageCategory from "./manage-category";

type Props = {
  categoryId: number;
  setCategoryId: (val: number) => void;
};

export function SelectCategory({ categoryId, setCategoryId }: Props) {
  const [manageCategory, setManageCategory] = useState(false);

  const { data, isFetching } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: getCategoryExpenses,
  });

  return (
    <div className="w-full flex gap-2 items-end">
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
              <SelectLabel>Kategori Pengeluaran</SelectLabel>
              {isFetching ? (
                <div className="flex items-center justify-center p-4">
                  <Spinner />
                </div>
              ) : (
                data?.data.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Button onClick={() => setManageCategory(true)}>+ Kategori</Button>
      <ManageCategory open={manageCategory} setOpen={setManageCategory} />
    </div>
  );
}
