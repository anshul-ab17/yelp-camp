import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let countSql = 'SELECT COUNT(*) as count FROM campgrounds';
    let selectSql = 'SELECT * FROM campgrounds';
    const queryParams: any[] = [];

    if (search) {
      const searchPattern = `%${search}%`;
      countSql += ' WHERE title LIKE ? OR location LIKE ?';
      selectSql += ' WHERE title LIKE ? OR location LIKE ?';
      queryParams.push(searchPattern, searchPattern);
    }

    selectSql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const countRow = db.prepare(countSql).get(...queryParams) as { count: number };
    const total = countRow ? countRow.count : 0;

    const campgroundsRaw = db.prepare(selectSql).all(...queryParams, limit, offset) as any[];

    const campgrounds = campgroundsRaw.map((row) => ({
      _id: row.id,
      title: row.title,
      location: row.location,
      price: row.price,
      description: row.description,
      images: JSON.parse(row.images_json),
      geometry: {
        type: 'Point',
        coordinates: [row.geometry_lng, row.geometry_lat] as [number, number],
      },
    }));

    const hasMore = offset + campgrounds.length < total;

    return NextResponse.json({ campgrounds, hasMore });
  } catch (error: any) {
    console.error('API Campgrounds error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
