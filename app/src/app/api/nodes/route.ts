import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eraId = searchParams.get('eraId');

    const nodes = await prisma.node.findMany({
      where: eraId ? { eraId: parseInt(eraId) } : {},
      include: { children: true, parentNode: true }, // 親子関係も取得
    });
    return NextResponse.json(nodes);
  } catch (error) {
    console.error('Error fetching nodes:', error);
    return NextResponse.json({ error: 'Failed to fetch nodes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newNode = await prisma.node.create({
      data: {
        id: body.id,
        type: body.type,
        label: body.label,
        description: body.description,
        masterpieces: body.masterpieces,
        position_x: body.position.x,
        position_y: body.position.y,
        width: body.width,
        height: body.height,
        parentNodeId: body.parentNodeId,
        eraId: body.eraId ? parseInt(body.eraId) : null,
      },
    });
    return NextResponse.json(newNode, { status: 201 });
  } catch (error) {
    console.error('Error creating node:', error);
    return NextResponse.json({ error: 'Failed to create node' }, { status: 500 });
  }
}
