export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return 'Rs. 0';
  return `Rs. ${Math.round(num).toLocaleString('en-US')}`;
}
