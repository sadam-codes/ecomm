import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deleteProduct, getProducts } from "../api/products.APIs";
import type { Product } from "../types";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AllProducts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 30000,
  });

  const [confirmId, setConfirmId] = useState<number | null>(null);
  const qc = useQueryClient();
  const del = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const products = useMemo(() => (data as Product[]) || [], [data]);

  if (isLoading) {
    return (
      <section className="min-h-[40vh] bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-sm text-neutral-300">Loading products…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-[40vh] bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-sm">There was a problem fetching products. Please try again.</p>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white py-10">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
            <p className="mt-1 text-sm text-neutral-400">Browse & manage inventory</p>
          </div>
          <Link
            to="/create"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            + Create Product
          </Link>
        </header>

        {products.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 text-center text-neutral-300">
            No products yet. <Link to="/create" className="text-green-400 underline">Create one</Link>.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article
                key={p.id}
                className="group rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 shadow-sm transition-colors hover:border-green-500/60"
              >
                <Link to={`/products/${p.id}`}>
                  <img
                    src={p.image || "/placeholder.svg"}
                    alt={p.name}
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                </Link>
                <h2 className="mt-3 text-lg font-semibold">
                  <Link className="transition-colors group-hover:text-green-400" to={`/products/${p.id}`}>
                    {p.name}
                  </Link>
                </h2>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-400">{p.description}</p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-green-400">
                    ${typeof p.price === "number" ? p.price.toFixed(2) : p.price}
                  </span>
                  <span className="rounded-md border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300">
                    {p.category}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to={`/edit/${p.id}`}
                    className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setConfirmId(p.id)}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete product?"
        message="This action cannot be undone."
        confirmText={del.isPending ? "Deleting…" : "Delete"}
        onConfirm={() => {
          if (confirmId != null) del.mutate(confirmId);
          setConfirmId(null);
        }}
        onCancel={() => setConfirmId(null)}
      />
    </main>
  );
}
