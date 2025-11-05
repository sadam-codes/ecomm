import React from "react";
import ProductForm from "../components/ProductForm";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const nav = useNavigate();
  return (
    <main className="min-h-screen bg-neutral-950 py-10 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <ProductForm mode="create" onSuccess={() => nav("/")} />
      </div>
    </main>
  );
}
