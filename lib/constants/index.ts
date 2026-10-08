export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Wide Vogue';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'An ecommrce store to buy the latest fashion trends';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const LATEST_PRODUCT_LIMIT = Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

export const signInDefaultValues = {
    email: '',
    password: '',
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
    state: '',
    postalCode: '',
    contactNumber: '',
    country: '',
  }

  export const PAYMENT_METHODS = ['UPI', 'Card', 'NetBanking', 'CashOnDelivery'];
  export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'UPI';

  export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

  export const productDefaultValues = {
    name: '',
    slug: '',
    category: '',
    images: [],
    sizes: [],
    brand: '',
    description: '',
    price: '0',
    stock: 0,
    rating: '0',
    numReviews: '0',
    isFeatured: false,
    banner: null,
    isReturnable: false,
    returnWindowDays: 0,
    returnPolicyText: '',
  };

  export const USER_ROLES = process.env.USER_ROLES ? process.env.USER_ROLES.split(',') : ['user', 'admin'];

  export const reviewFormDefaultValues = {
    title: '',
    comment: '',
    rating: 0,
  };

  export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';