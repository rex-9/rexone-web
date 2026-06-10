import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { paymentService } from "../../services";
import { AlertMessage, Button, Typography } from "../molecules";
import LayoutPage from "./LayoutPage";

type ViewState = "success" | "cancel" | "error" | "pending";

const PaymentStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("");

  const resourceId =
    params.id ||
    searchParams.get("session_id") ||
    searchParams.get("payment_intent") ||
    searchParams.get("id") ||
    "";
  const sessionId = searchParams.get("session_id") || "";
  const paymentIntentId = searchParams.get("payment_intent") || "";

  const routeStatus: ViewState = useMemo(() => {
    if (location.pathname === AppRoutes.client.public.PAYMENT_SUCCESS) {
      return "success";
    }

    if (location.pathname === AppRoutes.client.public.PAYMENT_CANCEL) {
      return "cancel";
    }

    if (location.pathname === AppRoutes.client.public.PAYMENT_ERROR) {
      return "error";
    }

    return "pending";
  }, [location.pathname]);

  useEffect(() => {
    if (!resourceId) return;

    let isMounted = true;

    const loadStatus = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await paymentService.getPaymentStatus({
          id: resourceId || undefined,
          session_id: sessionId || undefined,
          payment_intent: paymentIntentId || undefined,
          payment_intent_id: paymentIntentId || undefined,
        });
        const status = response.data?.status;
        const payload = response.data?.data;

        if (!status?.success) {
          throw new Error(status?.error || response.error || "Failed to fetch payment status.");
        }

        const normalizedStatus =
          payload?.paymentStatus || payload?.payment_status || payload?.status || "";

        if (isMounted) {
          setApiStatus(normalizedStatus.toLowerCase());
        }
      } catch (statusError) {
        const message =
          statusError instanceof Error
            ? statusError.message
            : "Unable to fetch payment status right now.";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadStatus();

    return () => {
      isMounted = false;
    };
  }, [paymentIntentId, resourceId, sessionId]);

  const effectiveState: ViewState = useMemo(() => {
    if (apiStatus.includes("succeeded") || apiStatus.includes("paid")) {
      return "success";
    }

    if (apiStatus.includes("cancel")) {
      return "cancel";
    }

    if (apiStatus.includes("fail") || apiStatus.includes("error")) {
      return "error";
    }

    return routeStatus;
  }, [apiStatus, routeStatus]);

  const title =
    effectiveState === "success"
      ? "Payment successful"
      : effectiveState === "cancel"
        ? "Payment canceled"
        : effectiveState === "error"
          ? "Payment failed"
          : "Checking payment";

  const description =
    effectiveState === "success"
      ? "Your payment was completed successfully."
      : effectiveState === "cancel"
        ? "Your payment was canceled before completion."
        : effectiveState === "error"
          ? "Payment could not be completed. Please try again."
          : "We are confirming your payment status.";

  return (
    <LayoutPage>
      <section className="w-full max-w-xl px-6 py-12">
        <Typography className="text-3xl font-semibold mb-3" variant="primary">
          {title}
        </Typography>
        <Typography className="text-base mb-6">{description}</Typography>

        {isLoading && (
          <Typography className="text-sm opacity-70 mb-4">Loading latest payment status...</Typography>
        )}

        {resourceId && (
          <Typography className="text-sm opacity-70 mb-4">Reference ID: {resourceId}</Typography>
        )}

        {apiStatus && (
          <Typography className="text-sm opacity-70 mb-4">Backend status: {apiStatus}</Typography>
        )}

        {error && <AlertMessage message={error} type="error" />}

        <div className="flex flex-wrap gap-3 mt-6">
          <Button onClick={() => navigate(AppRoutes.client.public.PAYMENT)}>
            Pay Again
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(AppRoutes.client.public.ROOT)}
          >
            Back to Home
          </Button>
        </div>
      </section>
    </LayoutPage>
  );
};

export default PaymentStatusPage;
