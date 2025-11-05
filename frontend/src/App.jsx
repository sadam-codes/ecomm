import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AllProducts from "./pages/AllProducts";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <nav className="flex h-14 items-center justify-between">
            <Link to="/" className="font-semibold tracking-tight hover:opacity-90">
              {`Products Admin`}
            </Link>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-900"
              >
                {`All Products`}
              </Link>
              <Link
                to="/create"
                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                {`Create Product`}
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<AllProducts />} />
          <Route path="/create" element={<CreateProduct />} />
          <Route path="/edit/:id" element={<EditProduct />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
