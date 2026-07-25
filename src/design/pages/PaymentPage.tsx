import React, { useState, useEffect } from "react";
import { useLoading } from "../../contexts/LoadingContext";
import { useToast } from "../../contexts/ToastContext";
import { paymentController } from "../../controllers";
import { Button } from "../components/button/Button";
import { LayoutPage } from "./LayoutPage";

export const PaymentPage: React.FC = () => {
  const { setLoading } = useLoading();
  const { success, error } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [productsResult, subscriptionsResult] = await Promise.all([
      paymentController.getProducts(),
      paymentController.getSubscriptions(),
    ]);

    if (productsResult.success && productsResult.products) {
      setProducts(productsResult.products);
    } else {
      error(productsResult.error || "Failed to load products");
    }

    if (subscriptionsResult.success && subscriptionsResult.subscriptions) {
      setSubscriptions(subscriptionsResult.subscriptions);
    }
    setLoading(false);
  };

  const handleCheckout = (productId: string) => {
    paymentController.createCheckout(
      productId,
      (url) => {
        success("Redirecting to checkout...");
        window.location.href = url;
      },
      (err) => {
        error(err);
      },
    );
  };

  const isSubscribed = (productId: string) => {
    return subscriptions.some(
      (sub) => sub.product_id === productId && sub.active,
    );
  };

  return (
    <LayoutPage>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-gray-500">
          Select the option that works best for you
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-xl">{product.name}</h3>
              <p className="text-gray-500 text-sm">{product.description}</p>

              <div className="mt-4">
                <span className="text-3xl font-bold">{product.price}</span>
                <span className="text-gray-500 text-sm ml-1">
                  {product.recurring
                    ? `/${product.period_label}`
                    : " (one-time)"}
                </span>
              </div>

              <div className="divider"></div>

              {isSubscribed(product.id) ? (
                <div className="badge badge-success gap-2 text-sm py-3">
                  ✅ Active Subscription
                </div>
              ) : (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => handleCheckout(product.id)}
                >
                  {product.recurring ? "Subscribe Now" : "Buy Now"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </LayoutPage>
  );
};
