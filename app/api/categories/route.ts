import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const per_page = searchParams.get('per_page') || '20';
  

  const wcUrl = `${process.env.WC_URL}/wp-json/wc/v3/products/categories`;
  
  const auth = Buffer.from(`${process.env.WC_KEY}:${process.env.WC_SECRET}`).toString('base64');

  try {
    const response = await fetch(`${wcUrl}?per_page=${per_page}&hide_empty=false`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    const data = await response.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid response from store" }, { status: 500 });
    }

    const categories = data
      .filter((cat: any) => cat.slug !== 'uncategorized')
      .map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image ? { 
          src: cat.image.src, 
          alt: cat.image.alt || cat.name 
        } : null,
      }));

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}