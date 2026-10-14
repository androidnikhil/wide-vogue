export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Madhav Shringaar';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Handcrafted Shri Laddu Gopal Ji poshak, designer mukut, bansuri, moti haar, and devotional shringaar operating from Agra & Noida with express pan-India delivery.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://www.madhavshringaar.com' : 'http://localhost:3000');
export const LATEST_PRODUCT_LIMIT = Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

export const DEFAULT_SEO_TITLE = 'Madhav Shringaar | Divine Laddu Gopal Ji Poshak & Shringaar - Agra & Noida';
export const DEFAULT_SEO_DESCRIPTION = 'Madhav Shringaar operates from Agra and Noida, providing authentic Vrindavan-crafted Shri Laddu Gopal Ji poshak (0-6 No.), designer mukut, bansuri, singhasan & sacred shringaar with express delivery in Agra, Noida, Delhi NCR & all over India.';

export const SEO_KEYWORDS = [
  'Laddu Gopal poshak Agra',
  'Laddu Gopal dress Noida',
  'Kanha ji poshak Agra',
  'Kanha ji dress Noida',
  'Laddu Gopal poshak Delhi NCR',
  'Laddu Gopal dress 0 to 6 number',
  'designer Laddu Gopal poshak',
  'Vrindavan poshak online',
  'Mathura Laddu Gopal dress',
  'Krishna shringaar store Agra',
  'devotional items store Noida',
  'Laddu Gopal mukut bansuri set',
  'Thakur ji poshak Agra',
  'Thakur ji dress Noida',
  'Bal Gopal shringaar',
  'Janmashtami special poshak',
  'Laddu Gopal singhasan jhula',
  'pure silk Laddu Gopal dress',
  'handcrafted deity dress',
  'Madhav Shringaar Agra',
  'Madhav Shringaar Noida',
  'Braj shringaar online India',
];

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
    sizeVariants: [],
    brand: '',
    description: '',
    price: '0',
    originalPrice: '0',
    discountPercent: 0,
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

  export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'info@madhavshringaar.com';
  export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'nikhil.pandey@madhavshringaar.com';
  export const SUPPORT_PHONE = process.env.SUPPORT_PHONE || '+91 79821 60480';
  export const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '7982160480';
  export const COMPANY_GSTIN = process.env.COMPANY_GSTIN || '09EHFPP7126A1ZE';
  export const COMPANY_MSME = process.env.COMPANY_MSME || 'UDYAM-UP-01-0152376';