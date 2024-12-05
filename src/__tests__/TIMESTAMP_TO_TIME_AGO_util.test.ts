import timestampToTimeAgo from '@/lib/utils/timestampToTimeAgo';  // Adjust the path accordingly

describe('timestampToTimeAgo', () => {
  
  it('should return "Just now" if the timestamp is less than a minute ago', () => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - 30 * 1000);  // 30 seconds ago
    expect(timestampToTimeAgo(timestamp)).toBe('Just now');
  });

  it('should return the correct minutes ago', () => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - 5 * 60 * 1000);  // 5 minutes ago
    expect(timestampToTimeAgo(timestamp)).toBe('5 minutes ago');
  });

  it('should return "1 minute ago" for exactly 1 minute ago', () => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - 1 * 60 * 1000);  // 1 minute ago
    expect(timestampToTimeAgo(timestamp)).toBe('1 minute ago');
  });

  it('should return the correct hours ago', () => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - 3 * 60 * 60 * 1000);  // 3 hours ago
    expect(timestampToTimeAgo(timestamp)).toBe('3 hours ago');
  });

  it('should return "1 hour ago" for exactly 1 hour ago', () => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - 1 * 60 * 60 * 1000);  // 1 hour ago
    expect(timestampToTimeAgo(timestamp)).toBe('1 hour ago');
  });

  it('should return the correct days ago', () => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);  // 2 days ago
    expect(timestampToTimeAgo(timestamp)).toBe('2 days ago');
  });

  it('should return "1 day ago" for exactly 1 day ago', () => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);  // 1 day ago
    expect(timestampToTimeAgo(timestamp)).toBe('1 day ago');
  });

  it('should return the correct months ago', () => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - 2 * 30 * 24 * 60 * 60 * 1000);  // 2 months ago
    expect(timestampToTimeAgo(timestamp)).toBe('2 months ago');
  });

  it('should return "1 month ago" for exactly 1 month ago', () => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - 1 * 30 * 24 * 60 * 60 * 1000);  // 1 month ago
    expect(timestampToTimeAgo(timestamp)).toBe('1 month ago');
  });

  it('should return the correct years ago', () => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000);  // 3 years ago
    expect(timestampToTimeAgo(timestamp)).toBe('3 years ago');
  });

  it('should return "1 year ago" for exactly 1 year ago', () => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - 1 * 365 * 24 * 60 * 60 * 1000);  // 1 year ago
    expect(timestampToTimeAgo(timestamp)).toBe('1 year ago');
  });

  it('should handle edge case for exactly now (0 milliseconds)', () => {
    const now = new Date();
    const timestamp = new Date(now.getTime());
    expect(timestampToTimeAgo(timestamp)).toBe('Just now');
  });
  
});
