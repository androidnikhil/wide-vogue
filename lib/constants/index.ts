export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Wide Vogue';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'An ecommrce store to buy the latest fashion trends';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const LATEST_PRODUCT_LIMIT = Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

export const signInDefaultValues = {
    email: 'admin@example.com',
    password: '123456',
  };
   
export const signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  export const shippingAddressDefaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
  }

  export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(',') : ['PayPal', 'Stripe', 'CashOnDelivery'];
  export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

  export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 2;