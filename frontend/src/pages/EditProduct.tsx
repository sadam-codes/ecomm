import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../api/products.APIs";
import ProductForm from "../components/ProductForm";
import type { Product } from "../types";

export default function EditProduct() {
  const { id } = useParams();
  const nav = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <section className="min-h-[40vh] bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-sm text-neutral-300">Loading product…</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="min-h-[40vh] bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-sm">Couldn’t load that product.</p>
      </section>
    );
  }

  const p = data as Product;

  return (
    <main className="min-h-screen bg-neutral-950 py-10 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <ProductForm
          mode="edit"
          initial={p}
          productId={p.id}
          onSuccess={() => nav("/")}
        />
      </div>
    </main>
  );
}
