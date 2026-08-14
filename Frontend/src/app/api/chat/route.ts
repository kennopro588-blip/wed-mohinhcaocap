import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Bạn là LUXE AI — trợ lý tư vấn thông minh của cửa hàng mô hình cao cấp "LUXE Models".

THÔNG TIN CỬA HÀNG:
- Tên: LUXE Models
- Chuyên: mô hình cao cấp chính hãng — xe hơi tỉ lệ (1/18, 1/24, 1/64), máy bay, tàu chiến, nhân vật anime, figure
- Thương hiệu: Tamiya, Bandai, Trumpeter, Hasegawa, Revell, Hot Wheels, Tomica...
- Giá: từ 150.000đ đến 5.000.000đ tùy dòng sản phẩm
- Kho hàng: hơn 130 sản phẩm sẵn hàng
- Địa chỉ: TP. Hồ Chí Minh, Việt Nam
- Hotline: 0909 123 456
- Email: bengao513@gmail.com
- Zalo: 0909 123 456
- Facebook: facebook.com/luxemodels
- Giờ làm việc: Thứ 2 – Thứ 7, 8:00 – 21:00

CHÍNH SÁCH:
- Giao hàng toàn quốc, 2–5 ngày làm việc
- Nội thành HCM giao trong ngày
- Miễn phí ship đơn từ 500.000đ
- Đổi trả trong 7 ngày nếu lỗi nhà sản xuất hoặc giao sai
- Thanh toán: COD, chuyển khoản, MoMo, ZaloPay, thẻ tín dụng

PHONG CÁCH TRẢ LỜI:
- Thân thiện, nhiệt tình, chuyên nghiệp
- Trả lời bằng tiếng Việt
- Ngắn gọn, đúng trọng tâm (tối đa 3–4 câu mỗi tin nhắn)
- Dùng emoji phù hợp để tạo cảm giác thân thiện
- Nếu không biết thông tin cụ thể, hãy hướng dẫn khách liên hệ hotline 0909 123 456
- KHÔNG bịa đặt thông tin sản phẩm cụ thể mà bạn không chắc chắn
- Khi khách hỏi mua hàng, hãy khuyến khích xem sản phẩm trên trang web`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Tin nhắn không hợp lệ' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key chưa được cấu hình' }, { status: 500 });
    }

    // Build conversation history for context
    const contents: { role: string; parts: { text: string }[] }[] = [];

    // Add chat history if any
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === 'user' || msg.role === 'model') {
          contents.push({
            role: msg.role,
            parts: [{ text: msg.text }],
          });
        }
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const requestBody = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Không thể kết nối AI lúc này, vui lòng thử lại sau' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Xin lỗi, tôi không hiểu câu hỏi này. Bạn vui lòng liên hệ hotline **0909 123 456** để được hỗ trợ trực tiếp nhé! 😊';

    return NextResponse.json({ reply: aiText });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi, vui lòng thử lại' },
      { status: 500 }
    );
  }
}
