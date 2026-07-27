import React, { useEffect, useState } from "react";
import AppConfig from "../../../AppConfig";
import AppRoutes from "../../../AppRoutes";
import { useOrderPayment } from "../../../hooks";
import type { IPurchasableResource } from "../../../models";
import { orderService } from "../../../services";
import {
  AlertMessage,
  Button,
  PaymentForm,
} from "../../molecules";
import LayoutPage from "../LayoutPage";

const PaymentPage: React.FC = () => {
  const quantity = 1;
  const resourceId = AppConfig.PAYMENT_RESOURCE_ID;
  const [resource, setResource] = useState<IPurchasableResource | null>(null);
  const [isResourceLoading, setIsResourceLoading] = useState(true);
  const [resourceError, setResourceError] = useState("");
  const {
    clientSecret,
    error,
    isPreparing,
    order,
    preparePayment,
  } = useOrderPayment(
    window.sessionStorage,
  );

  useEffect(() => {
    let active = true;

    const loadResource = async () => {
      setIsResourceLoading(true);
      setResourceError("");
      try {
        if (!AppConfig.PAYMENT_PRODUCT_ID || !resourceId) {
          throw new Error("The payment resource is not configured.");
        }
        const response = await orderService.getPurchasableResource({
          productId: AppConfig.PAYMENT_PRODUCT_ID,
          resourceId,
        });
        const result = response.data?.data;
        if (!response.data?.status.success || !result) {
          throw new Error(
            response.data?.status.error ||
              response.error ||
              "Unable to load product details.",
          );
        }
        if (active) setResource(result);
      } catch (loadError) {
        if (active) {
          setResourceError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load product details.",
          );
        }
      } finally {
        if (active) setIsResourceLoading(false);
      }
    };

    void loadResource();
    return () => {
      active = false;
    };
  }, [resourceId]);

  return (
    <LayoutPage>
      <section className="w-full bg-[#f5f6f8] py-10 md:min-h-screen">
        <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 md:grid-cols-[38%_62%] md:px-8">
          <div className="rounded-xl bg-[#172554] p-6 text-white">
            <p className="text-sm text-white/70">Product</p>
            <p className="mt-1 text-2xl font-semibold">
              {resource?.title ?? "Product"}
            </p>
            <p className="mt-1 text-sm text-white/75">Qty {quantity}</p>

            {resource?.imageUrl && (
              <img
                src={resource.imageUrl}
                alt={resource.title}
                className="mt-4 h-44 w-full rounded-lg object-cover"
              />
            )}

            {resource?.description && (
              <p className="mt-4 text-sm text-white/85">
                {resource.description}
              </p>
            )}

            <p className="mt-6 text-2xl font-semibold">
              {isResourceLoading
                ? "Loading..."
                : (resource?.displayAmount ?? "--")}
            </p>

            {resourceError && (
              <div className="mt-4">
                <AlertMessage type="error" message={resourceError} />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Complete your payment
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Card details are entered securely with Stripe.
            </p>

            <div className="mt-6">
              {error && <AlertMessage message={error} type="error" />}
              {!clientSecret || !order ? (
                <Button
                  onClick={() =>
                    void preparePayment(
                      AppConfig.PAYMENT_PRODUCT_ID,
                      resourceId,
                      quantity,
                    )
                  }
                  disabled={
                    isPreparing ||
                    isResourceLoading ||
                    Boolean(resourceError) ||
                    !resource
                  }
                  fullWidth
                >
                  {isPreparing ? "Preparing payment..." : "Continue to payment"}
                </Button>
              ) : (
                <PaymentForm
                  clientSecret={clientSecret}
                  returnUrl={`${AppConfig.CLIENT_BASE_URL}${AppRoutes.client.public.PAYMENT_STATUS}/${order.id}`}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </LayoutPage>
  );
};

export default PaymentPage;
