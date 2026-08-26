import React, { useState, useEffect } from "react";
import { useLoading } from "../../../contexts/LoadingContext";
import { useToast } from "../../../contexts/ToastContext";
import { Button } from "../../../design/components/button/Button";
import { ConfirmDialog } from "../../../design/components/overlay";
import { LayoutPage } from "../../../design/pages";
import { IProduct, ISubscription, ITransaction } from "..";
import { PaymentController } from "..";

export const PaymentPage: React.FC = () => {
  const { setLoading } = useLoading();
  const { success, error } = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
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
  }, [setLoading]);

  useEffect(() => {
    const loadPaymentData = async () => {
      await fetchData();
    };

    void loadPaymentData();
  }, [fetchData]);

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
      () => fetchData(),
      (err) => error(err),
    );
  };

  const handleResume = (subscriptionId: string) => {
    PaymentController.resumeSubscription(
      subscriptionId,
      () => fetchData(),
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

  const renderProductActions = (product: IProduct) => {
    const activeSub = getActiveSubscription(product.id);
    const canceledSub = getCanceledSubscription(product.id);
    const fullyCanceledSub = getFullyCanceledSubscription(product.id);
    const purchaseCount = getPurchaseCount(product.id);

    // Active subscription
    if (activeSub) {
      const activeUntil = activeSub.current_period_end
        ? new Date(activeSub.current_period_end).toLocaleDateString()
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
            onClick={() => setCancelTargetId(activeSub.id)}
          >
            Cancel Subscription
          </Button>
        </div>
      );
    }

    // Canceled but still active (scheduled for cancellation)
    if (canceledSub) {
      const activeUntil = canceledSub.current_period_end
        ? new Date(canceledSub.current_period_end).toLocaleDateString()
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
      <div className="text-center space-y-8 mb-16">
        <h1 className="text-h1 font-semibold text-center">Choose Your Plan</h1>
        <p className="text-body-m text-base-content/70 text-center">
          Select the option that works best for you
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-24">
        {products.map((product) => (
          <div
            key={product.id}
            className="card bg-base-100 shadow-s rounded-m border border-base-200"
          >
            <div className="card-body p-24">
              <h3 className="card-title text-h3 font-semibold">
                {product.name}
              </h3>
              <p className="text-body-s text-base-content/70">
                {product.description}
              </p>

              <div className="mt-16">
                <span className="text-h2 font-semibold">{product.price}</span>
                <span className="text-body-s text-base-content/60 ml-4">
                  {product.recurring
                    ? `/${product.period_label}`
                    : " (one-time)"}
                </span>
              </div>

              <div className="divider my-16"></div>
              {renderProductActions(product)}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={cancelTargetId !== null}
        onClose={() => setCancelTargetId(null)}
        onConfirm={() => {
          if (cancelTargetId) {
            handleCancel(cancelTargetId);
            setCancelTargetId(null);
          }
        }}
        title="Cancel Subscription"
        message="Your subscription will remain active until the end of the billing period. Are you sure you want to cancel?"
        confirmLabel="Cancel Subscription"
        cancelLabel="Keep Subscription"
        isDestructive={true}
      />
    </LayoutPage>
  );
};
