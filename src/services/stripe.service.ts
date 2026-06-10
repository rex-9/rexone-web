import { loadStripe, type Stripe } from "@stripe/stripe-js";
import AppConfig from "../AppConfig";

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripePublishableKey = (): string =>
  AppConfig.STRIPE_PUBLISHABLE_KEY;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = getStripePublishableKey();
    if (!publishableKey) {
      console.error(
        "Stripe publishable key is missing. Set VITE_STRIPE_PUBLISHABLE_KEY.",
      );
      stripePromise = Promise.resolve(null);
      return stripePromise;
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};
