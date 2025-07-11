import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isBeforeTwoPM } from './date.utils';

describe('date.utils', () => {
  describe('isBeforeTwoPM', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers(); // Corrected function name
    });

    it('should return true if the time is before 8 PM (20:00)', () => {
      // Set time to 19:59:59
      const mockDate = new Date(2024, 1, 1, 19, 59, 59);
      vi.setSystemTime(mockDate);
      expect(isBeforeTwoPM()).toBe(true);
    });

    it('should return false if the time is exactly 8 PM (20:00)', () => {
      // Set time to 20:00:00
      const mockDate = new Date(2024, 1, 1, 20, 0, 0);
      vi.setSystemTime(mockDate);
      expect(isBeforeTwoPM()).toBe(false);
    });

    it('should return false if the time is after 8 PM (20:00)', () => {
      // Set time to 20:00:01
      const mockDate = new Date(2024, 1, 1, 20, 0, 1);
      vi.setSystemTime(mockDate);
      expect(isBeforeTwoPM()).toBe(false);
    });

    it('should return true for a morning hour like 10 AM', () => {
        // Set time to 10:00:00
        const mockDate = new Date(2024, 1, 1, 10, 0, 0);
        vi.setSystemTime(mockDate);
        expect(isBeforeTwoPM()).toBe(true);
      });
  });
});
