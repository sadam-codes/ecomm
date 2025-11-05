import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProductPayload, UpdateProductPayload } from "../types";
import { createProduct, updateProduct } from "../api/products.APIs";

type ProductFormProps = {
  mode: "create" | "edit";
  initial?: Partial<UpdateProductPayload>;
  productId?: number;
  onSuccess?: () => void;
};

export default function ProductForm({
  mode,
  initial,
  productId,
  onSuccess,
}: ProductFormProps) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Partial<CreateProductPayload>>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? ("" as any),
    image: initial?.image ?? "",
    category: initial?.category ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const isEdit = mode === "edit";

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        price:
          typeof form.price === "string" ? parseFloat(form.price) : form.price,
      } as CreateProductPayload;

      if (
        !payload.name ||
        !payload.category ||
        payload.price == null ||
        Number.isNaN(payload.price)
      ) {
        throw new Error("Please fill name, category, and a valid price.");
      }

      return isEdit && productId
        ? updateProduct(productId, payload as UpdateProductPayload)
        : createProduct(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      if (onSuccess) onSuccess();
    },
    onError: (e: any) => {
      setError(e?.message || "Something went wrong");
    },
  });

  const title = useMemo(
    () => (isEdit ? "Edit Product" : "Create Product"),
    [isEdit]
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate();
      }}
      className="mx-auto max-w-xl rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 text-white shadow"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-neutral-400">Watches & Shoes inventory</p>

      <div className="mt-5 grid grid-cols-1 gap-4">
        <input
          name="name"
          placeholder="Product name"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
          value={form.name as string}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <textarea
          name="description"
          placeholder="Description"
          rows={3}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
          value={form.description as string}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price (e.g. 199.99)"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
          value={(form.price as any) ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
        />
        <input
          name="image"
          placeholder="Image URL"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
          value={form.image as string}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
        />
        <input
          name="category"
          placeholder="Category (watches, shoes)"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
          value={form.category as string}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-5 flex items-center gap-2">
        <button
          disabled={mutation.isPending}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
        >
          {isEdit ? "Save changes" : "Create product"}
        </button>
        {mutation.isPending && (
          <span className="text-xs text-neutral-400">Saving…</span>
        )}
      </div>
    </form>
  );
}
