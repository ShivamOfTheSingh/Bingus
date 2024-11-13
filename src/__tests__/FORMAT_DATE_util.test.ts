import formatDate from '@/lib/utils/formatDate'; // Adjust the path accordingly

describe('formatDate', () => {
  it('should format a valid Date object correctly', () => {
    const date = new Date(2024, 0, 1); // January 1, 2024
    expect(formatDate(date)).toBe('1 January, 2024');
  });

  it('should format a valid date string correctly', () => {
    const dateStr = '2024-01-01T00:00:00Z'; // ISO 8601 string for January 1, 2024
    expect(formatDate(dateStr)).toBe('1 January, 2024');
  });

  it('should throw an error if the date is invalid', () => {
    // Invalid date object (e.g., invalid date string)
    const invalidDateStr = 'invalid-date-string';
    expect(() => formatDate(invalidDateStr)).toThrow(TypeError);
    expect(() => formatDate(invalidDateStr)).toThrow('Invalid date');
  });

  it('should throw an error if the input is null', () => {
    const invalidDate = null;
    // Ensure the TypeError is thrown for invalid inputs
    expect(() => formatDate(invalidDate as any)).toThrow(TypeError);
    expect(() => formatDate(invalidDate as any)).toThrow('Invalid date');
  });

  it('should throw an error if the input is undefined', () => {
    const invalidDate = undefined;
    // Ensure the TypeError is thrown for invalid inputs
    expect(() => formatDate(invalidDate as any)).toThrow(TypeError);
    expect(() => formatDate(invalidDate as any)).toThrow('Invalid date');
  });

  it('should correctly format a date on the last day of the month', () => {
    const date = new Date(2024, 1, 29); // February 29, 2024 (Leap year)
    expect(formatDate(date)).toBe('29 February, 2024');
  });

  it('should correctly format a date on the first day of the month', () => {
    const date = new Date(2024, 0, 1); // January 1, 2024
    expect(formatDate(date)).toBe('1 January, 2024');
  });

  it('should correctly format a date on the last day of the year', () => {
    const date = new Date(2024, 11, 31); // December 31, 2024
    expect(formatDate(date)).toBe('31 December, 2024');
  });
});
