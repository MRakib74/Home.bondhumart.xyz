import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the first settings record, or return defaults
    let settings = await prisma.storeSettings.findFirst();
    
    if (!settings) {
      return NextResponse.json({
        pixelId: '',
        deliveryInside: 80,
        deliveryOutside: 150,
        bannerText: 'Welcome to Bondhumart! Get 10% off on your first order.',
        contactPhone: '01XXXXXXXXX'
      });
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Check if settings already exist
    let settings = await prisma.storeSettings.findFirst();
    
    if (settings) {
      // Update existing
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: {
          pixelId: data.pixelId,
          deliveryInside: Number(data.deliveryInside),
          deliveryOutside: Number(data.deliveryOutside),
          bannerText: data.bannerText,
          contactPhone: data.contactPhone
        }
      });
    } else {
      // Create new
      settings = await prisma.storeSettings.create({
        data: {
          pixelId: data.pixelId,
          deliveryInside: Number(data.deliveryInside),
          deliveryOutside: Number(data.deliveryOutside),
          bannerText: data.bannerText,
          contactPhone: data.contactPhone
        }
      });
    }
    
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
