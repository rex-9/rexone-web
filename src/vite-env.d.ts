/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
	readonly VITE_PAYMENT_PRODUCT_ID?: string;
	readonly VITE_PAYMENT_RESOURCE_ID?: string;
	readonly VITE_STRIPE_PRODUCT_ID?: string;
	readonly VITE_STRIPE_PRICE_ID?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
