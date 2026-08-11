import { NextResponse } from 'next/server';
import { products, searchProducts } from '@/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const filter = searchParams.get('filter');

  let result = [...products];

  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }

  if (search) {
    result = searchProducts(search);
  }

  if (filter === 'new') {
    result = result.filter(p => p.isNew);
  } else if (filter === 'sale') {
    result = result.filter(p => p.isSale);
  }

  return NextResponse.json({
    success: true,
    total: result.length,
    data: result,
  });
}
