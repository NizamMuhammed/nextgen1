import React, { useEffect, useState } from "react";
import UiCard from "./components/ui/UiCard";
import UiButton from "./components/ui/UiButton";

export default function Home({ onAddToCart, isLoggedIn, promptLogin }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch products");
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="p-6">Loading products...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <UiCard key={product._id} className="flex flex-col h-full justify-between">
            <div>
              <h2 className="font-semibold text-lg mb-1">{product.name}</h2>
              <p className="mb-2 text-gray-600 min-h-[48px]">{product.description}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="font-bold text-xl text-blue-700">${product.price}</span>
              <UiButton
                variant="contained"
                color="primary"
                onClick={() => {
                  if (!isLoggedIn) {
                    promptLogin();
                  } else {
                    onAddToCart(product);
                  }
                }}
                className="ml-2"
              >
                Add to Cart
              </UiButton>
            </div>
          </UiCard>
        ))}
      </div>
    </div>
  );
}
