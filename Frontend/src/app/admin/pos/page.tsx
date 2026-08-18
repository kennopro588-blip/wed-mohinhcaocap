'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchAdminProducts, createOrder, updateAdminProduct, ApiProduct } from '@/services/api';
import { products as fallbackProducts, formatPrice } from '@/data/products';

interface PosCartItem {
  product: ApiProduct;
  quantity: number;
}

export default function AdminPosPage() {
  const [productList, setProductList] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<PosCartItem[]>([]);
  
  // Customer & Payment info
  const [customerName, setCustomerName] = useState('Khách mua tại Showroom');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'TIEN_MAT' | 'CHUYEN_KHOAN' | 'VNPAY' | 'THE_ATM'>('TIEN_MAT');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchAdminProducts();
      if (data && data.length > 0) {
        setProductList(data);
      } else {
        setProductList(fallbackProducts as any);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return productList.filter(p => {
      const matchSearch =
        !searchQuery ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [productList, searchQuery, selectedCategory]);

  // Cart operations
  const addToCart = (product: ApiProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as PosCartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCashGiven(0);
    setDiscountPercent(0);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = subtotal - discountAmount;
  const changeDue = Math.max(0, cashGiven - grandTotal); // Tiền thối

  // Checkout and Print Receipt (K80 thermal bill)
  const handleCheckoutAndPrint = async () => {
    if (cart.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm vào hóa đơn!');
      return;
    }

    const orderCode = 'POS-' + Math.floor(100000 + Math.random() * 900000);
    const currentDate = new Date().toLocaleString('vi-VN');

    // 1. Create order in MySQL backend
    try {
      await createOrder({
        orderCode,
        fullName: customerName || 'Khách mua tại Showroom',
        phone: customerPhone || 'Tại quầy',
        email: 'pos@luxe.vn',
        address: 'Showroom Luxe Models, TP.HCM',
        city: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        paymentMethod,
        totalAmount: grandTotal,
        status: 'Hoàn thành',
        items: cart.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          imageUrl: i.product.imageUrl || '',
        })),
      });

      // 2. Reduce stock for each product
      for (const item of cart) {
        const curStock = item.product.stockCount ?? 5;
        const newStock = Math.max(0, curStock - item.quantity);
        await updateAdminProduct(item.product.id, {
          ...item.product,
          stockCount: newStock,
          inStock: newStock > 0,
        });
      }
    } catch (e) {
      console.warn('Backend order save:', e);
    }

    // 3. Print K80 thermal receipt
    printReceiptK80({
      orderCode,
      date: currentDate,
      cashier: 'Thu ngân 01',
      customerName,
      customerPhone,
      items: cart,
      subtotal,
      discountAmount,
      discountPercent,
      grandTotal,
      paymentMethod,
      cashGiven,
      changeDue,
    });

    showToast(`🎉 Thanh toán đơn hàng #${orderCode} thành công & đã in hóa đơn!`);
    clearCart();
  };

  // Helper print thermal receipt K80
  const printReceiptK80 = (bill: any) => {
    const printWin = window.open('', '_blank', 'width=420,height=650');
    if (!printWin) return;

    const itemsHtml = bill.items
      .map(
        (it: PosCartItem, idx: number) => `
        <tr>
          <td colspan="3" style="padding-top:4px;font-weight:bold;font-size:12px;">${it.product.name}</td>
        </tr>
        <tr style="border-bottom:1px dashed #bbb;font-size:11.5px;">
          <td style="padding-bottom:4px;">${it.quantity} x ${(it.product.price || 0).toLocaleString('vi-VN')}</td>
          <td></td>
          <td style="text-align:right;padding-bottom:4px;font-weight:bold;">${((it.product.price || 0) * it.quantity).toLocaleString('vi-VN')} ₫</td>
        </tr>
      `
      )
      .join('');

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Hóa Đơn #${bill.orderCode}</title>
        <style>
          @page { size: 80mm auto; margin: 3mm; }
          body {
            font-family: 'Courier New', Courier, monospace, 'Segoe UI', Tahoma, sans-serif;
            width: 74mm;
            margin: 0 auto;
            padding: 4px;
            color: #000;
            font-size: 12px;
            line-height: 1.35;
          }
          .text-center { text-align: center; }
          .logo { font-size: 16px; font-weight: 900; letter-spacing: 1px; }
          .sublogo { font-size: 10px; margin-bottom: 6px; }
          .divider { border-top: 1px dashed #000; margin: 6px 0; }
          .double-divider { border-top: 2px solid #000; margin: 6px 0; }
          table { width: 100%; border-collapse: collapse; }
          .calc-row { display: flex; justify-content: space-between; margin: 2px 0; font-size: 12px; }
          .total-row { font-size: 14px; font-weight: 900; margin: 6px 0; }
          .footer { font-size: 10.5px; margin-top: 10px; text-align: center; }
          @media print { body { width: 100%; } }
        </style>
      </head>
      <body>
        <div class="text-center">
          <div class="logo">LUXE MODELS</div>
          <div class="sublogo">Mô Hình & Figure Chính Hãng Cao Cấp</div>
          <div style="font-size:10px;">Đ/c: Showroom 123 Lê Lợi, Quận 1, TP.HCM</div>
          <div style="font-size:10px;">Hotline: 1900 8888 | Web: luxe.vn</div>
          <div class="double-divider"></div>
          <div style="font-size:13px;font-weight:bold;">PHIẾU THANH TOÁN TẠI QUẦY</div>
          <div style="font-size:11px;">Mã HĐ: <strong>#${bill.orderCode}</strong></div>
          <div style="font-size:10px;color:#333;">${bill.date} | Thu ngân: ${bill.cashier}</div>
        </div>

        <div class="divider"></div>
        <div style="font-size:11px;">
          <div>Khách hàng: <strong>${bill.customerName}</strong></div>
          ${bill.customerPhone ? `<div>SĐT: ${bill.customerPhone}</div>` : ''}
        </div>
        <div class="divider"></div>

        <table>
          <thead>
            <tr style="border-bottom:1px solid #000;font-size:11px;font-weight:bold;">
              <th style="text-align:left;">Sản Phẩm</th>
              <th></th>
              <th style="text-align:right;">Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="divider"></div>
        <div class="calc-row">
          <span>Tạm tính:</span>
          <span>${bill.subtotal.toLocaleString('vi-VN')} ₫</span>
        </div>
        ${bill.discountAmount > 0 ? `
          <div class="calc-row" style="color:#000;">
            <span>Chiết khấu (${bill.discountPercent}%):</span>
            <span>-${bill.discountAmount.toLocaleString('vi-VN')} ₫</span>
          </div>
        ` : ''}
        <div class="double-divider"></div>
        <div class="calc-row total-row">
          <span>TỔNG CỘNG:</span>
          <span>${bill.grandTotal.toLocaleString('vi-VN')} ₫</span>
        </div>
        <div class="calc-row" style="font-size:11px;">
          <span>Thanh toán:</span>
          <span>${bill.paymentMethod}</span>
        </div>
        ${bill.cashGiven > 0 ? `
          <div class="calc-row" style="font-size:11px;">
            <span>Khách đưa:</span>
            <span>${bill.cashGiven.toLocaleString('vi-VN')} ₫</span>
          </div>
          <div class="calc-row" style="font-size:11px;font-weight:bold;">
            <span>Tiền thối:</span>
            <span>${bill.changeDue.toLocaleString('vi-VN')} ₫</span>
          </div>
        ` : ''}

        <div class="double-divider"></div>
        <div class="footer">
          <div>❤️ CẢM ƠN QUÝ KHÁCH & HẸN GẶP LẠI! ❤️</div>
          <div style="font-size:9.5px;margin-top:4px;">* Đổi trả sản phẩm lỗi do NSX trong vòng 7 ngày kèm hóa đơn này.</div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          backgroundColor: '#10b981', color: '#fff', padding: '12px 24px',
          borderRadius: '8px', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
          fontWeight: 700, fontSize: '14px'
        }}>
          ✓ {toastMessage}
        </div>
      )}

      {/* LEFT: Product Grid & Search */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem', overflow: 'hidden' }}>
        {/* Header Search & Category Filter */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Tìm nhanh tên mô hình, mã SP, thương hiệu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1, minWidth: '220px', padding: '10px 14px', borderRadius: '8px',
              border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none'
            }}
          />

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
          >
            <option value="all">Tất cả danh mục</option>
            <option value="gundam">Gundam & Mecha</option>
            <option value="figure">Anime Figures</option>
            <option value="diecast">Siêu Xe Diecast</option>
            <option value="resin">Tượng Resin</option>
          </select>
        </div>

        {/* Product Cards Grid */}
        <div style={{
          flex: 1, overflowY: 'auto', display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px', paddingRight: '4px'
        }}>
          {filteredProducts.map(p => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              style={{
                border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px',
                cursor: 'pointer', transition: 'all 0.15s', background: '#f8fafc',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}
              onMouseEnter={e => { (e.currentTarget as any).style.borderColor = '#2563eb'; (e.currentTarget as any).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as any).style.borderColor = '#e2e8f0'; (e.currentTarget as any).style.transform = 'none'; }}
            >
              <div>
                <div style={{ height: '90px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
                  <img
                    src={p.imageUrl || '/images/gundam.png'}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>{p.brand}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, height: '32px', overflow: 'hidden' }}>
                  {p.name}
                </div>
              </div>

              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#2563eb' }}>
                  {formatPrice(p.price)}
                </span>
                <span style={{ fontSize: '10px', color: '#64748b', background: '#e2e8f0', padding: '2px 5px', borderRadius: '4px' }}>
                  Kho: {p.stockCount ?? 5}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Bill & Checkout Panel */}
      <div style={{
        background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        {/* Bill Header */}
        <div style={{ padding: '14px 18px', background: '#0f172a', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>🧾 Hóa Đơn Bán Hàng</h3>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{cart.length} món trong giỏ</span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              style={{ background: 'transparent', border: 'none', color: '#f87171', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Customer Input */}
        <div style={{ padding: '10px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input
            type="text"
            placeholder="Tên khách hàng"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
          />
          <input
            type="tel"
            placeholder="Số điện thoại"
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
          />
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 10px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛒</div>
              <p style={{ fontSize: '13px', margin: 0 }}>Chưa có mô hình nào được chọn</p>
              <span style={{ fontSize: '11px' }}>Click vào sản phẩm bên trái để thêm</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e2e8f0' }}>
                <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.product.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {formatPrice(item.product.price)}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: 800, minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '4px', fontSize: '14px' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment & Calculation Box */}
        <div style={{ padding: '14px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          {/* Payment Method Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '10px' }}>
            {[
              { id: 'TIEN_MAT', label: '💵 Tiền mặt' },
              { id: 'CHUYEN_KHOAN', label: '📱 CK QR' },
              { id: 'VNPAY', label: '🏦 VNPay' },
              { id: 'THE_ATM', label: '💳 Quẹt thẻ' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id as any)}
                style={{
                  padding: '6px 2px', fontSize: '11px', fontWeight: 700, borderRadius: '6px',
                  border: paymentMethod === m.id ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                  background: paymentMethod === m.id ? '#eff6ff' : '#ffffff',
                  color: paymentMethod === m.id ? '#1d4ed8' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Discount & Cash received */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Chiết khấu (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={discountPercent}
                onChange={e => setDiscountPercent(Number(e.target.value))}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Tiền khách đưa (₫)</label>
              <input
                type="number"
                placeholder="0"
                value={cashGiven || ''}
                onChange={e => setCashGiven(Number(e.target.value))}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
            </div>
          </div>

          {/* Summary rows */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
            <span>Tạm tính:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#16a34a', marginBottom: '4px' }}>
              <span>Giảm giá ({discountPercent}%):</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '8px 0' }}>
            <span>Tổng thanh toán:</span>
            <span style={{ color: '#2563eb' }}>{formatPrice(grandTotal)}</span>
          </div>

          {cashGiven > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#d97706', marginBottom: '10px' }}>
              <span>Tiền thối lại:</span>
              <span>{formatPrice(changeDue)}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleCheckoutAndPrint}
            disabled={cart.length === 0}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
              background: cart.length > 0 ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#cbd5e1',
              color: '#ffffff', fontSize: '14px', fontWeight: 800, cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
              boxShadow: cart.length > 0 ? '0 4px 12px rgba(37,99,235,0.35)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <span>⚡</span>
            <span>THANH TOÁN & IN BILL (K80)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
