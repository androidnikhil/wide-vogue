export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Wide Vogue';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'An ecommrce store to buy the latest fashion trends';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const LATEST_PRODUCT_LIMIT = Number(process.env.LATEST_PRODUCT_LIMIT) || 4;
export const signInDefaultValues = {
    email: '',
    password: ''
}
export const signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };