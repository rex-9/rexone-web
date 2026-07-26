import React, { useState, useEffect } from "react";
import { useLoading } from "../../contexts/LoadingContext";
import { useToast } from "../../contexts/ToastContext";
import { PaymentController } from "../../controllers";
import { Button } from "../components/button/Button";
import { LayoutPage } from ".";

export const PaymentPage: React.FC = () => {
  const { setLoading } = useLoading();
  const { success, error } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [productsResult, subscriptionsResult, transactionsResult] =
      await Promise.all([
        PaymentController.getProducts(),
        PaymentController.getSubscriptions(),
        PaymentController.getTransactions(),
      ]);

    if (productsResult.success && productsResult.products) {
      setProducts(productsResult.products);
    }

    if (subscriptionsResult.success && subscriptionsResult.subscriptions) {
      setSubscriptions(subscriptionsResult.subscriptions);
    }

    if (transactionsResult.success && transactionsResult.transactions) {
      setTransactions(transactionsResult.transactions);
    }

    setLoading(false);
  };

  const handleCheckout = (productId: string) => {
    PaymentController.createCheckout(
      productId,
      (url) => {
        success("Redirecting to checkout...");
        window.location.href = url;
      },
      (err) => error(err),
    );
  };

  const handleCancel = (subscriptionId: string) => {
    PaymentController.cancelSubscription(
      subscriptionId,
      () => {
        success("Subscription will be canceled at the end of billing period");
        fetchData();
      },
      (err) => error(err),
    );
  };

  const handleResume = (subscriptionId: string) => {
    PaymentController.resumeSubscription(
      subscriptionId,
      () => {
        success("Subscription resumed successfully");
        fetchData();
      },
      (err) => error(err),
    );
  };

  const getPurchaseCount = (productId: string) => {
    return transactions.filter((t) => t.product_id === productId && t.paid)
      .length;
  };

  const getActiveSubscription = (productId: string) => {
    return subscriptions.find(
      (s) => s.product_id === productId && s.active && !s.canceled_at,
    );
  };

  const getCanceledSubscription = (productId: string) => {
    return subscriptions.find(
      (s) =>
        s.product_id === productId &&
        s.active &&
        s.canceled_at && // scheduled for cancellation
        !s.ended_at,
    );
  };

  const getFullyCanceledSubscription = (productId: string) => {
    return subscriptions.find(
      (s) => s.product_id === productId && s.status === "canceled",
    );
  };

  const renderProductActions = (product: any) => {
    const activeSub = getActiveSubscription(product.id);
    const canceledSub = getCanceledSubscription(product.id);
    const fullyCanceledSub = getFullyCanceledSubscription(product.id);
    const purchaseCount = getPurchaseCount(product.id);

    // Active subscription
    if (activeSub) {
      const activeUntil = activeSub.next_billing_at
        ? new Date(activeSub.next_billing_at).toLocaleDateString()
        : "end of period";

      return (
        <div className="space-y-3">
          <div className="badge badge-success gap-2 text-sm py-3">
            ✅ Active Subscription
          </div>
          <p className="text-xs text-gray-500">Next billing: {activeUntil}</p>
          <Button
            variant="secondary"
            fullWidth
            size="sm"
            onClick={() => handleCancel(activeSub.id)}
          >
            Cancel Subscription
          </Button>
        </div>
      );
    }

    // Canceled but still active (scheduled for cancellation)
    if (canceledSub) {
      const activeUntil = canceledSub.next_billing_at
        ? new Date(canceledSub.next_billing_at).toLocaleDateString()
        : "end of period";

      return (
        <div className="space-y-3">
          <div className="badge badge-warning gap-2 text-sm py-3">
            ⏳ Canceled (active until {activeUntil})
          </div>
          <Button
            variant="secondary"
            fullWidth
            size="sm"
            onClick={() => handleResume(canceledSub.id)}
          >
            Resume Subscription
          </Button>
        </div>
      );
    }

    // Fully canceled (ended) - can subscribe again
    if (fullyCanceledSub) {
      return (
        <div className="space-y-3">
          <div className="badge badge-error gap-2 text-sm py-3">
            ❌ Subscription Ended
          </div>
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleCheckout(product.id)}
          >
            Subscribe Again
          </Button>
        </div>
      );
    }

    // One-time product - show purchase count
    if (!product.recurring && purchaseCount > 0) {
      return (
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleCheckout(product.id)}
          >
            Buy Again
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Purchased {purchaseCount} time{purchaseCount > 1 ? "s" : ""}
          </p>
        </div>
      );
    }

    // Available for purchase
    return (
      <Button
        variant="primary"
        fullWidth
        onClick={() => handleCheckout(product.id)}
      >
        {product.recurring ? "Subscribe Now" : "Buy Now"}
      </Button>
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
              {renderProductActions(product)}
            </div>
          </div>
        ))}
      </div>
    </LayoutPage>
  );
};
