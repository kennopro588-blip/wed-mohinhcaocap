/**
 * Utility helper to remove Vietnamese diacritics / accents for flexible, logical search matching
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Multi-field smart matching function for a product and search query
 */
export function matchProductSearch(product: any, rawQuery: string): boolean {
  if (!rawQuery || !rawQuery.trim()) return true;

  const query = removeVietnameseAccents(rawQuery);
  const keywords = query.split(/\s+/); // split by spaces for multi-word match

  const searchTarget = removeVietnameseAccents(
    [
      product.id,
      product.name,
      product.brand,
      product.categoryId,
      product.category,
      product.subcategory,
      product.scaleRatio,
      product.scale,
      product.manufacturer,
      product.material,
      product.description,
      ...(product.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
  );

  // Every typed keyword must be matched in search target
  return keywords.every(kw => searchTarget.includes(kw));
}
