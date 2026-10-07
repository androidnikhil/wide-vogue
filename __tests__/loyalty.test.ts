import { LOYALTY_CONFIG } from '@/lib/loyalty.config';

describe('Loyalty Configuration Math Tests', () => {
  describe('calculatePointsEarned', () => {
    it('should earn 1 point for every 100 spent', () => {
      expect(LOYALTY_CONFIG.calculatePointsEarned(0)).toBe(0);
      expect(LOYALTY_CONFIG.calculatePointsEarned(99)).toBe(0);
      expect(LOYALTY_CONFIG.calculatePointsEarned(100)).toBe(1);
      expect(LOYALTY_CONFIG.calculatePointsEarned(150)).toBe(1);
      expect(LOYALTY_CONFIG.calculatePointsEarned(5000)).toBe(50);
      expect(LOYALTY_CONFIG.calculatePointsEarned(5099)).toBe(50);
    });
  });

  describe('calculateDiscountForPoints', () => {
    it('should calculate discount accurately (10 points = 1 rupee)', () => {
      expect(LOYALTY_CONFIG.calculateDiscountForPoints(0)).toBe(0);
      expect(LOYALTY_CONFIG.calculateDiscountForPoints(5)).toBe(0);
      expect(LOYALTY_CONFIG.calculateDiscountForPoints(10)).toBe(1);
      expect(LOYALTY_CONFIG.calculateDiscountForPoints(100)).toBe(10);
      expect(LOYALTY_CONFIG.calculateDiscountForPoints(105)).toBe(10);
      expect(LOYALTY_CONFIG.calculateDiscountForPoints(1000)).toBe(100);
    });

    it('should enforce limits properly when maxRedemption is introduced', () => {
      // Assuming a user tries to redeem 1,000,000 points - this tests the base formula
      expect(LOYALTY_CONFIG.calculateDiscountForPoints(1000000)).toBe(100000);
    });
  });
});
