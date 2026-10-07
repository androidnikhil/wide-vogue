// Bhakti Points System Configuration

export const LOYALTY_CONFIG = {
  // Earning points
  SPEND_AMOUNT_FOR_POINT: 100, // Spend ₹100 to get 1 point
  POINTS_EARNED_PER_AMOUNT: 1, 

  // Redeeming points
  POINTS_FOR_DISCOUNT: 10,     // 10 points = ₹1 discount
  DISCOUNT_VALUE: 1,           // ₹1

  // Function to calculate points earned on an order subtotal
  calculatePointsEarned: (subtotal: number) => {
    return Math.floor(subtotal / LOYALTY_CONFIG.SPEND_AMOUNT_FOR_POINT) * LOYALTY_CONFIG.POINTS_EARNED_PER_AMOUNT;
  },

  // Function to calculate monetary discount for X points
  calculateDiscountForPoints: (points: number) => {
    return Math.floor(points / LOYALTY_CONFIG.POINTS_FOR_DISCOUNT) * LOYALTY_CONFIG.DISCOUNT_VALUE;
  },
  
  // Max points that can be redeemed on a single order
  // e.g. capping at 50% of the cart value. We will handle this in cart logic.
};
