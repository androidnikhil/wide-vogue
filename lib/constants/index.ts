export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Madhav Shringaar';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Handcrafted Shri Laddu Gopal Ji poshak, designer mukut, bansuri, moti haar, and devotional shringaar operating from Agra & Noida with express pan-India delivery.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://www.madhavshringaar.com' : 'http://localhost:3000');
export const RAZORPAY_LOGO_URL =
  process.env.NEXT_PUBLIC_APP_URL &&
  process.env.NEXT_PUBLIC_APP_URL.startsWith('https://') &&
  !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')
    ? `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`
    : 'https://www.madhavshringaar.com/images/logo.png';
export const LATEST_PRODUCT_LIMIT = Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

export const DEFAULT_SEO_TITLE = 'Madhav Shringaar | Laddu Gopal Dress & Poshak Online';
export const DEFAULT_SEO_DESCRIPTION = 'Shop beautiful Laddu Gopal dresses, Kanha Ji poshak, mukut, mala and shringaar accessories at Madhav Shringaar. Explore traditional designs and convenient online shopping across India.';

export const SEO_KEYWORDS = [
  // High Priority Dress Keywords
  'Laddu Gopal dress online',
  'Laddu Gopal poshak',
  'Laddu Gopal Ji dress',
  'Kanha Ji dress online',
  'Laddu Gopal designer dress',
  'Laddu Gopal winter dress',
  'Laddu Gopal summer dress',
  'Handmade Laddu Gopal poshak',
  'Laddu Gopal dress price',
  'Small Kanha Ji dress',

  // Mukut and Jewellery Keywords
  'Laddu Gopal mukut',
  'Laddu Gopal mukut online',
  'Kanha Ji mukut online',
  'Laddu Gopal jewellery set',
  'Laddu Gopal mala',
  'Laddu Gopal mala online',
  'Kanha Ji shringaar items',
  'Laddu Gopal mor pankh mukut',
  'Laddu Gopal accessories online',
  'Laddu Gopal bansuri',
  'Laddu Gopal kanthi mala',
  'Laddu Gopal singhasan decoration',

  // Shringaar and Shopping Keywords
  'Laddu Gopal shringaar online',
  'Laddu Gopal shringaar set',
  'Kanha Ji shringaar online',
  'Laddu Gopal pooja accessories',
  'Laddu Gopal dress and jewellery set',
  'Laddu Gopal complete shringaar kit',
  'Thakur Ji poshak online',
  'Banke Bihari shringaar items',
  'Krishna Ji dress online',
  'Laddu Gopal gift set',

  // Long-tail High-Intent Keywords
  'Buy Laddu Gopal dress online in India',
  'Laddu Gopal poshak with mukut and mala',
  'Beautiful designer Kanha Ji poshak',
  'Laddu Gopal dress for Janmashtami',
  'Laddu Gopal winter woollen poshak',
  'Laddu Gopal dress size 0 to 6',
  'Affordable Laddu Gopal shringaar set',
  'Laddu Gopal dress with free delivery',
  'Laddu Gopal poshak wholesale',
  'Laddu Gopal dresses with COD',

  // Local SEO & Devotional Hubs
  'Laddu Gopal dress shop in Agra',
  'Laddu Gopal poshak in Agra',
  'Kanha Ji dress shop near me',
  'Laddu Gopal shringaar shop in Mathura',
  'Laddu Gopal dresses in Vrindavan',
  'Laddu Gopal poshak online India',
  'Laddu Gopal dress delivery in Noida',
  'Laddu Gopal shringaar delivery across India',
  'Madhav Shringaar Agra',
  'Madhav Shringaar Noida',

  // Devotional & Community Keywords
  'Laddu Gopal daily darshan',
  'Krishna bhakti India',
  'Vrindavan bhakti',
  'Laddu Gopal collection',
  'Laddu Gopal devotees',
  'Krishna bhakti group India',
  'Laddu Gopal poshak shopping',
  'Thakur Ji shringaar',
  'Vrindavan devotees',
  'Indian devotional shopping',
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
};

export const PAYMENT_METHODS = ['UPI', 'Card', 'NetBanking', 'CashOnDelivery', 'GiftCard'];
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

export const PRODUCT_CATEGORIES = [
  'Designer Poshak',
  'Special / Festival Poshak',
  'Poshak',
  'Winter Woolen Poshak',
  'Cotton Summer Poshak',
  'Mukut & Bansuri',
  'Mukut & Pagdi',
  'Bansuri',
  'Jewellery & Mala',
  'Moti Mala',
  'Kangan & Payal',
  'Singhasan',
  'Jhula',
  'Seva Essentials',
  'Festive Sets',
  'Complete Shringar',
] as const;

export const DEFAULT_RETURN_POLICY_TEXT = `Returns are accepted only for size issues or defective products. Customers must report the issue within 48 hours of delivery and provide clear photos or an unboxing video as proof. Products must be unused and returned in their original packaging. Return approval is subject to verification.

Returns are not accepted for change of mind, colour preference, or minor variations in handmade designs.`;

export const DEFAULT_RETURN_POLICY_HTML = `<p>Returns are accepted only for size issues or defective products. Customers must report the issue within 48 hours of delivery and provide clear photos or an unboxing video as proof. Products must be unused and returned in their original packaging. Return approval is subject to verification.</p><p>Returns are not accepted for change of mind, colour preference, or minor variations in handmade designs.</p>`;

export const USER_ROLES = process.env.USER_ROLES ? process.env.USER_ROLES.split(',') : ['user', 'admin'];

export const reviewFormDefaultValues = {
  title: '',
  comment: '',
  description: '',
  rating: 0,
  images: [] as string[],
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'info@madhavshringaar.com';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'nikhil.pandey@madhavshringaar.com';
export const SUPPORT_PHONE = process.env.SUPPORT_PHONE || '+91 70782 11946';
export const CALLING_PHONE = process.env.CALLING_PHONE || '+91 70782 11946';
export const CALLING_NUMBER = '7078211946';
export const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '7982160480';
export const COMPANY_GSTIN = process.env.COMPANY_GSTIN || '09EHFPP7126A1ZE';
export const COMPANY_MSME = process.env.COMPANY_MSME || 'UDYAM-UP-01-0152376';


/**
 * Checks if an email is an old auto-generated dummy phone email (e.g. 9876543210@madhavshringaar.com)
 * Real store email addresses (like nikhil.pandey@madhavshringaar.com or info@madhavshringaar.com) are NEVER dummy emails.
 */
export const isDummyPhoneEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const trimmed = email.trim().toLowerCase();
  if (trimmed === 'nikhil.pandey@madhavshringaar.com' || trimmed === 'info@madhavshringaar.com') {
    return false;
  }
  return /^\+?\d+@madhavshringaar\.com$/i.test(trimmed);
};