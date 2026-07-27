import { loadStripe, type Stripe } from "@stripe/stripe-js";
import AppConfig from "../AppConfig";

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripePromise = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = AppConfig.STRIPE_PUBLISHABLE_KEY
      ? loadStripe(AppConfig.STRIPE_PUBLISHABLE_KEY)
      : Promise.resolve(null);
  }

  return stripePromise;
};
