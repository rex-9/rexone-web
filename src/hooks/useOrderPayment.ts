import { useCallback, useRef, useState } from "react";
import type { ICreatePaymentIntentResult, IOrder } from "../models";
import { orderService, paymentService } from "../services";

export const PAYMENT_ORDER_ID_KEY = "payment.order_id";
const PAYMENT_INTENT_ID_PREFIX = "payment.intent_id.";

type PaymentStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const savePaymentOrder = (
  storage: PaymentStorage,
  order: IOrder,
) => {
  storage.setItem(PAYMENT_ORDER_ID_KEY, order.id);
};

export const getPaymentOrderId = (storage: PaymentStorage): string =>
  storage.getItem(PAYMENT_ORDER_ID_KEY) || "";

export const savePaymentIntentId = (
  storage: PaymentStorage,
  orderId: string,
  paymentIntentId: string,
) => {
  storage.setItem(
    `${PAYMENT_INTENT_ID_PREFIX}${orderId}`,
    paymentIntentId,
  );
};

export const getPaymentIntentId = (
  storage: PaymentStorage,
  orderId: string,
): string =>
  storage.getItem(`${PAYMENT_INTENT_ID_PREFIX}${orderId}`) || "";

export const clearPaymentSession = (
  storage: PaymentStorage,
  orderId: string,
) => {
  storage.removeItem(PAYMENT_ORDER_ID_KEY);
  storage.removeItem(`${PAYMENT_INTENT_ID_PREFIX}${orderId}`);
};

export const createOrderPaymentIntent = async ({
  productId,
  quantity,
  resourceId,
  storage,
}: {
  productId: string;
  quantity: number;
  resourceId: string;
  storage: PaymentStorage;
}): Promise<{
  order: IOrder;
  paymentIntent: ICreatePaymentIntentResult;
}> => {
  const orderResponse = await orderService.createOrder({
    resourceId,
    quantity,
  });
  const order = orderResponse.data?.data;
  if (!orderResponse.data?.status.success || !order) {
    throw new Error(
      orderResponse.data?.status.error ||
        orderResponse.error ||
        "Unable to create order.",
    );
  }
  savePaymentOrder(storage, order);

  const intentResponse = await paymentService.createPaymentIntent(
    order.id,
    productId,
    resourceId,
    quantity,
  );
  const paymentIntent = intentResponse.data?.data;
  if (!intentResponse.data?.status.success || !paymentIntent) {
    throw new Error(
      intentResponse.data?.status.error ||
        intentResponse.error ||
        "Unable to prepare payment.",
    );
  }
  savePaymentIntentId(storage, order.id, paymentIntent.paymentIntentId);

  return { order, paymentIntent };
};

export const useOrderPayment = (storage: PaymentStorage) => {
  const requestLock = useRef(false);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState("");

  const preparePayment = useCallback(
    async (productId: string, resourceId: string, quantity: number) => {
      if (requestLock.current) return;
      requestLock.current = true;
      setIsPreparing(true);
      setError("");

      try {
        const result = await createOrderPaymentIntent({
          productId,
          quantity,
          resourceId,
          storage,
        });
        setOrder(result.order);
        setClientSecret(result.paymentIntent.clientSecret);
      } catch (prepareError) {
        setError(
          prepareError instanceof Error
            ? prepareError.message
            : "Unable to prepare payment.",
        );
      } finally {
        requestLock.current = false;
        setIsPreparing(false);
      }
    },
    [storage],
  );

  return {
    clientSecret,
    error,
    isPreparing,
    order,
    preparePayment,
  };
};
