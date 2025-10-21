import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const eras = await prisma.era.findMany();
    return NextResponse.json(eras);
  } catch (error) {
    console.error('Error fetching eras:', error);
    return NextResponse.json({ error: 'Failed to fetch eras' }, { status: 500 });
  }
}
