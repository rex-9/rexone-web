import type { IApiAuthResponse, IApiResponse, IOrder, IOrderCheckoutData } from "../models";
import orderService from "./order.service";

export const CHECKOUT_ORDER_ID_KEY = "checkout.order_id";
export const CHECKOUT_ORDER_NUMBER_KEY = "checkout.order_number";

type CheckoutStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const saveCheckoutOrder = (storage: CheckoutStorage, order: IOrder) => {
  storage.setItem(CHECKOUT_ORDER_ID_KEY, order.id);
  storage.setItem(CHECKOUT_ORDER_NUMBER_KEY, order.order_number);
};

export const clearCheckoutOrder = (storage: CheckoutStorage) => {
  storage.removeItem(CHECKOUT_ORDER_ID_KEY);
  storage.removeItem(CHECKOUT_ORDER_NUMBER_KEY);
};

export const getCheckoutOrderId = (storage: CheckoutStorage): string =>
  storage.getItem(CHECKOUT_ORDER_ID_KEY) || "";

export const claimCheckoutSubmission = (lock: { current: boolean }): boolean => {
  if (lock.current) return false;
  lock.current = true;
  return true;
};

const unwrap = <T>(response: IApiResponse<IApiAuthResponse<T>>): T => {
  const envelope = response.data;
  if (!envelope?.status.success || !envelope.data) {
    throw new Error(
      envelope?.status.error || response.error || "Unable to start checkout.",
    );
  }
  return envelope.data as T;
};

export const startNewOrderCheckout = async (
  resourceId: string,
  quantity: number,
  storage: CheckoutStorage,
): Promise<IOrderCheckoutData> => {
  const created = unwrap<{ order: IOrder }>(
    await orderService.createOrder({ resource_id: resourceId, quantity }),
  );
  // Persist before Checkout creation so a failed second request remains retryable.
  saveCheckoutOrder(storage, created.order);
  return retryOrderCheckout(created.order.id, storage);
};

export const retryOrderCheckout = async (
  orderId: string,
  storage: CheckoutStorage,
): Promise<IOrderCheckoutData> => {
  const checkout = unwrap<IOrderCheckoutData>(
    await orderService.startCheckout(orderId),
  );
  saveCheckoutOrder(storage, checkout.order);
  return checkout;
};

export const redirectToCheckout = (
  checkoutUrl: string,
  assign: (url: string) => void,
) => {
  if (!checkoutUrl) throw new Error("Checkout was created without a redirect URL.");
  assign(checkoutUrl);
};
