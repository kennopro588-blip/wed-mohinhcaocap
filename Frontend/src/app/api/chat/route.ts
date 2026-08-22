import { NextRequest, NextResponse } from 'next/server';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  categoryId?: string;
  subcategory?: string;
  scaleRatio?: string;
  inStock?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  description?: string;
}

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
- Ngắn gọn, đúng trọng tâm (tối đa 2–3 câu văn bản)
- Dùng emoji phù hợp để tạo cảm giác thân thiện
- Nếu không biết thông tin cụ thể, hãy hướng dẫn khách liên hệ hotline 0909 123 456
- KHÔNG bịa đặt thông tin sản phẩm cụ thể mà bạn không chắc chắn

QUAN TRỌNG - GỢI Ý SẢN PHẨM:
Khi khách hỏi về sản phẩm, tìm kiếm, hoặc muốn mua hàng, bạn PHẢI trả lời theo định dạng JSON đặc biệt sau:
{
  "text": "Câu trả lời ngắn gọn của bạn ở đây",
  "products": ["ID_SP_1", "ID_SP_2", "ID_SP_3"]
}

Trong đó "products" là mảng các ID sản phẩm phù hợp từ danh sách sản phẩm được cung cấp (tối đa 4 sản phẩm).
Nếu không có sản phẩm liên quan, bỏ qua trường "products" và chỉ trả về text thuần.
Nếu câu hỏi KHÔNG liên quan đến sản phẩm (hỏi về chính sách, liên hệ, v.v.), chỉ trả về text thuần KHÔNG có JSON.`;

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://localhost:8080/api/user/products', {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

function buildProductContext(products: Product[]): string {
  if (!products.length) return '';
  const lines = products.map(p =>
    `- ID: ${p.id} | Tên: ${p.name} | Thương hiệu: ${p.brand} | Giá: ${p.price.toLocaleString('vi-VN')}đ | Tỉ lệ: ${p.scaleRatio || 'N/A'} | Danh mục: ${p.subcategory || p.categoryId || ''} | Còn hàng: ${p.inStock ? 'Có' : 'Hết'}`
  );
  return `\nDANH SÁCH SẢN PHẨM HIỆN CÓ (dùng ID để gợi ý):\n${lines.join('\n')}\n`;
}

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

    // Fetch real products from backend
    const products = await fetchProducts();
    const productContext = buildProductContext(products);

    // Build system prompt with product context
    const fullSystemPrompt = SYSTEM_PROMPT + productContext;

    // Build conversation history
    const contents: { role: string; parts: { text: string }[] }[] = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === 'user' || msg.role === 'model') {
          contents.push({ role: msg.role, parts: [{ text: msg.text }] });
        }
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const requestBody = {
      system_instruction: { parts: [{ text: fullSystemPrompt }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Xin lỗi, tôi không hiểu câu hỏi này. Bạn vui lòng liên hệ hotline **0909 123 456** để được hỗ trợ trực tiếp nhé! 😊';

    // Try to parse JSON response with product suggestions
    let replyText = rawText;
    let suggestedProductIds: string[] = [];
    let suggestedProducts: Product[] = [];

    try {
      // Extract JSON block if AI returned one (may be wrapped in ```json ... ```)
      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) ||
                        rawText.match(/(\{[\s\S]*"products"[\s\S]*\})/);
      const jsonStr = jsonMatch ? jsonMatch[1] : rawText.trim();
      const parsed = JSON.parse(jsonStr);
      if (parsed.text) {
        replyText = parsed.text;
        suggestedProductIds = parsed.products || [];
      }
    } catch {
      // Not JSON — plain text response, keep as-is
    }

    // Resolve product details by ID
    if (suggestedProductIds.length > 0 && products.length > 0) {
      suggestedProducts = suggestedProductIds
        .map(id => products.find(p => String(p.id) === String(id)))
        .filter((p): p is Product => !!p)
        .slice(0, 4);
    }

    return NextResponse.json({
      reply: replyText,
      products: suggestedProducts.length > 0 ? suggestedProducts : undefined,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi, vui lòng thử lại' },
      { status: 500 }
    );
  }
}
