import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../api/products.APIs";
import type { Product } from "../types";

export default function ProductDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <section className="min-h-[40vh] bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-sm text-neutral-300">Loading…</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="min-h-[40vh] bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-sm">Product not found.</p>
      </section>
    );
  }

  const p = data as Product;

  return (
    <main className="min-h-screen bg-neutral-950 py-10 text-white">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
          <img
            src={p.image || "/placeholder.svg"}
            alt={p.name}
            className="aspect-video w-full rounded-lg object-cover"
          />
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{p.name}</h1>
              <p className="mt-1 text-sm text-neutral-300">{p.description}</p>
              <span className="mt-2 inline-block rounded-md border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300">
                {p.category}
              </span>
            </div>
            <div className="text-2xl font-semibold text-green-400">
              ${typeof p.price === "number" ? p.price.toFixed(2) : p.price}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <Link to="/" className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800">
              Back
            </Link>
            <Link to={`/edit/${p.id}`} className="rounded-lg bg-green-600 px-3 py-1.5 text-sm hover:bg-green-700">
              Edit
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
