import React, { useEffect, useMemo, useState } from "react";
import AppConfig from "../../AppConfig";
import { useAuth } from "../../contexts";
import { paymentService } from "../../services";
import { AlertMessage, CheckoutButton } from "../molecules";
import LayoutPage from "./LayoutPage";

const PaymentPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const quantity = 1;
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [productError, setProductError] = useState("");
  const [productTitle, setProductTitle] = useState("Stripe Product");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState("");
  const [displayAmount, setDisplayAmount] = useState("--");

  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;

    const fetchProductDetails = async () => {
      setIsProductLoading(true);
      setProductError("");

      try {
        const response = await paymentService.getProductDetails({
          product_id: AppConfig.STRIPE_PRODUCT_ID,
          price_id: AppConfig.STRIPE_PRICE_ID,
        });

        const status = response.data?.status;
        const data = response.data?.data;

        if (!status?.success || !data) {
          throw new Error(
            status?.error || response.error || "Unable to load product details.",
          );
        }

        const title = data.product?.title || "Stripe Product";
        const description = data.product?.description || "";
        const photo = data.product?.photo || data.product?.photos?.[0] || "";
        const amount =
          data.price?.display_amount ||
          (typeof data.price?.unit_amount === "number"
            ? `${(data.price.unit_amount / 100).toFixed(2)} ${String(
                data.price.currency || "usd",
              ).toUpperCase()}`
            : "--");

        if (isMounted) {
          setProductTitle(title);
          setProductDescription(description);
          setProductImage(photo);
          setDisplayAmount(amount);
        }
      } catch (error) {
        if (!isMounted) return;
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load product details.";
        setProductError(message);
      } finally {
        if (isMounted) {
          setIsProductLoading(false);
        }
      }
    };

    void fetchProductDetails();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const summaryAmount = useMemo(() => {
    if (isProductLoading) return "Loading...";
    return displayAmount;
  }, [displayAmount, isProductLoading]);

  return (
    <LayoutPage>
      <section className="w-full bg-[#f5f6f8] py-10 md:min-h-screen">
        <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 md:grid-cols-[38%_62%] md:px-8">
          <div className="rounded-xl bg-[#172554] p-6 text-white">
            <p className="text-sm text-white/70">Product</p>
            <p className="mt-1 text-2xl font-semibold">{productTitle}</p>
            <p className="mt-1 text-sm text-white/75">Qty {quantity}</p>

            {productImage && (
              <img
                src={productImage}
                alt={productTitle}
                className="mt-4 h-44 w-full rounded-lg object-cover"
              />
            )}

            {productDescription && (
              <p className="mt-4 text-sm text-white/85">{productDescription}</p>
            )}

            <p className="mt-6 text-2xl font-semibold">{summaryAmount}</p>

            {productError && (
              <div className="mt-4">
                <AlertMessage type="error" message={productError} />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
            <h1 className="text-2xl font-semibold text-slate-900">Complete your payment</h1>
            <p className="mt-1 text-sm text-slate-500">
              Card details are entered securely on Stripe Checkout.
            </p>

            <div className="mt-6">
              <CheckoutButton
                priceId={AppConfig.STRIPE_PRICE_ID}
                quantity={quantity}
                disabled={isProductLoading || Boolean(productError)}
              />
            </div>
          </div>
        </div>
      </section>
    </LayoutPage>
  );
};

export default PaymentPage;
