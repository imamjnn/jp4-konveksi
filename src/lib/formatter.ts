export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    // style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Set 2 jika butrake desimal
  }).format(number);
};

export function parseNumber(value: string) {
  return Number(value.replace(/\./g, ""));
}
