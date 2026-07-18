import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Campground from '@/models/Campground';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    await connectToDatabase();

    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const total = await Campground.countDocuments(filter);
    const rawCampgrounds = await Campground.find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const campgrounds = rawCampgrounds.map((doc) => {
      const camp = doc.toObject({ virtuals: true });
      return {
        _id: camp._id.toString(),
        title: camp.title,
        location: camp.location,
        price: camp.price,
        description: camp.description,
        images: camp.images.map((img: any) => ({
          url: img.url,
          filename: img.filename,
        })),
        geometry: {
          type: camp.geometry.type,
          coordinates: [camp.geometry.coordinates[0], camp.geometry.coordinates[1]] as [number, number],
        },
      };
    });

    const hasMore = offset + campgrounds.length < total;

    return NextResponse.json({ campgrounds, hasMore });
  } catch (error: any) {
    console.error('API Campgrounds error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
