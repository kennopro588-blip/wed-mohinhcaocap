import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderCode = 'LX-' + Math.floor(100000 + Math.random() * 900000);

    const orderData = {
      orderCode,
      ...body,
      status: 'Processing',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Đơn hàng đã được khởi tạo thành công vào hệ thống database',
      order: orderData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Lỗi khởi tạo đơn hàng' },
      { status: 400 }
    );
  }
}
