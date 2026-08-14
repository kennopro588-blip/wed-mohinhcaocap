/**
 * Export & Print Helper Utility for Admin Dashboard
 * Supports:
 * - Word (.doc) with complete Vietnamese UTF-8 formatting & luxury header
 * - Excel (.xls / .csv) with UTF-8 BOM
 * - Print (A4 Printable Report & Invoice with signature blocks)
 */

export interface ExportColumn {
  header: string;
  key: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (val: any, row: any) => string;
}

/**
 * Export table data to a Word (.doc) file
 */
export function exportToWord(
  title: string,
  columns: ExportColumn[],
  data: any[],
  filename = 'bao-cao-luxe-models.doc',
  subtitle = 'Hệ thống Quản lý Luxe Models'
) {
  const currentDate = new Date().toLocaleString('vi-VN');

  const headersHtml = columns
    .map(
      c =>
        `<th style="background:#0f172a;color:#ffffff;padding:10px 12px;border:1px solid #334155;text-align:${c.align || 'left'};font-weight:bold;font-size:11pt;">${c.header}</th>`
    )
    .join('');

  const rowsHtml = data
    .map((row, rIdx) => {
      const bg = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
      const cells = columns
        .map(c => {
          let val = row[c.key];
          if (c.formatter) val = c.formatter(val, row);
          else if (val === null || val === undefined) val = '';
          return `<td style="padding:8px 10px;border:1px solid #cbd5e1;text-align:${c.align || 'left'};font-size:10.5pt;">${val}</td>`;
        })
        .join('');
      return `<tr style="background:${bg};">${cells}</tr>`;
    })
    .join('');

  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; color: #1e293b; padding: 20px; line-height: 1.5; }
        h1 { color: #0f172a; font-size: 18pt; margin-bottom: 4px; text-transform: uppercase; }
        .meta { color: #475569; font-size: 10pt; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; }
        .sign-box { text-align: center; width: 30%; float: left; }
        .sign-title { font-weight: bold; font-size: 11pt; }
        .sign-sub { font-style: italic; font-size: 9.5pt; color: #64748b; margin-top: 2px; }
        .sign-space { height: 70px; }
      </style>
    </head>
    <body>
      <div style="border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 20px;">
        <div style="font-size: 14pt; font-weight: bold; color: #d97706;">LUXE MODELS VIỆT NAM</div>
        <div style="font-size: 9.5pt; color: #64748b;">Hệ Thống Phân Phối Mô Hình Chính Hãng & Cao Cấp Toàn Quốc</div>
      </div>

      <h1>${title}</h1>
      <div class="meta">
        <div><strong>Phân hệ:</strong> ${subtitle}</div>
        <div><strong>Thời gian xuất:</strong> ${currentDate}</div>
        <div><strong>Tổng số bản ghi:</strong> ${data.length}</div>
      </div>

      <table class="table">
        <thead>
          <tr>${headersHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div style="margin-top: 40px; width: 100%; clear: both;">
        <table style="width: 100%; border: none;">
          <tr>
            <td style="width: 33%; text-align: center; border: none;">
              <div class="sign-title">Người Lập Biểu</div>
              <div class="sign-sub">(Ký, ghi rõ họ tên)</div>
              <div class="sign-space"></div>
            </td>
            <td style="width: 33%; text-align: center; border: none;">
              <div class="sign-title">Kế Toán / Quản Kho</div>
              <div class="sign-sub">(Ký, ghi rõ họ tên)</div>
              <div class="sign-space"></div>
            </td>
            <td style="width: 34%; text-align: center; border: none;">
              <div class="sign-title">Giám Đốc Phê Duyệt</div>
              <div class="sign-sub">(Ký và đóng dấu)</div>
              <div class="sign-space"></div>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export table data to Excel (.xls) file with UTF-8 BOM
 */
export function exportToExcel(
  title: string,
  columns: ExportColumn[],
  data: any[],
  filename = 'danh-sach-luxe-models.xls'
) {
  const headers = columns.map(c => `<th style="background:#1e293b;color:#fff;border:1px solid #94a3b8;">${c.header}</th>`).join('');
  const rows = data
    .map(row => {
      const cells = columns
        .map(c => {
          let val = row[c.key];
          if (c.formatter) val = c.formatter(val, row);
          else if (val === null || val === undefined) val = '';
          return `<td style="border:1px solid #cbd5e1;mso-number-format:'\\@';">${val}</td>`;
        })
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  const tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"/></head>
    <body>
      <h2>${title}</h2>
      <table border="1">${headers}${rows}</table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Print standard data table directly in browser (Print / PDF)
 */
export function printTable(
  title: string,
  columns: ExportColumn[],
  data: any[],
  subtitle = 'Hệ thống Quản lý Luxe Models'
) {
  const currentDate = new Date().toLocaleString('vi-VN');

  const headersHtml = columns
    .map(
      c =>
        `<th style="background:#1e293b;color:#ffffff;padding:8px 10px;border:1px solid #334155;text-align:${c.align || 'left'};font-size:12px;">${c.header}</th>`
    )
    .join('');

  const rowsHtml = data
    .map((row, rIdx) => {
      const bg = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
      const cells = columns
        .map(c => {
          let val = row[c.key];
          if (c.formatter) val = c.formatter(val, row);
          else if (val === null || val === undefined) val = '';
          return `<td style="padding:6px 10px;border:1px solid #e2e8f0;text-align:${c.align || 'left'};font-size:12px;">${val}</td>`;
        })
        .join('');
      return `<tr style="background:${bg};">${cells}</tr>`;
    })
    .join('');

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 0; padding: 10px; line-height: 1.4; }
        .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
        .logo { font-size: 20px; font-weight: 800; color: #d97706; }
        .sublogo { font-size: 11px; color: #64748b; }
        h1 { font-size: 18px; font-weight: 800; margin: 0 0 6px; text-transform: uppercase; color: #0f172a; }
        .meta { font-size: 12px; color: #475569; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .signatures { margin-top: 40px; display: flex; justify-content: space-between; page-break-inside: avoid; }
        .sign-box { text-align: center; width: 30%; }
        .sign-title { font-weight: 700; font-size: 13px; }
        .sign-sub { font-style: italic; font-size: 11px; color: #64748b; margin-top: 2px; }
        .sign-space { height: 60px; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">LUXE MODELS</div>
          <div class="sublogo">Hệ thống phân phối Mô hình cao cấp & chính hãng</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          <div>Hotline: 1900 8888</div>
          <div>Website: localhost:3000</div>
        </div>
      </div>

      <h1>${title}</h1>
      <div class="meta">
        <div><strong>Danh mục / Báo cáo:</strong> ${subtitle}</div>
        <div><strong>Ngày in:</strong> ${currentDate} | <strong>Tổng số lượng:</strong> ${data.length} bản ghi</div>
      </div>

      <table>
        <thead><tr>${headersHtml}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>

      <div class="signatures">
        <div class="sign-box">
          <div class="sign-title">Người Lập Biểu</div>
          <div class="sign-sub">(Ký, họ tên)</div>
          <div class="sign-space"></div>
        </div>
        <div class="sign-box">
          <div class="sign-title">Kế Toán Trưởng</div>
          <div class="sign-sub">(Ký, họ tên)</div>
          <div class="sign-space"></div>
        </div>
        <div class="sign-box">
          <div class="sign-title">Giám Đốc Điều Hành</div>
          <div class="sign-sub">(Ký, đóng dấu)</div>
          <div class="sign-space"></div>
        </div>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Print a single Order Invoice (Phiếu Xuất Kho / Hóa Đơn Bán Hàng)
 */
export function printOrderInvoice(order: any) {
  const currentDate = new Date().toLocaleString('vi-VN');
  const printWindow = window.open('', '_blank', 'width=850,height=750');
  if (!printWindow) return;

  const itemsHtml = (order.items || [])
    .map(
      (it: any, idx: number) => `
      <tr>
        <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;">${idx + 1}</td>
        <td style="padding:8px;border:1px solid #e2e8f0;">
          <strong>${it.productName || it.name || 'Mô hình Luxe'}</strong>
          <div style="font-size:11px;color:#64748b;">Mã SP: ${it.productId || 'N/A'}</div>
        </td>
        <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;">${it.quantity}</td>
        <td style="padding:8px;border:1px solid #e2e8f0;text-align:right;">${(it.price || 0).toLocaleString('vi-VN')} ₫</td>
        <td style="padding:8px;border:1px solid #e2e8f0;text-align:right;font-weight:bold;">${((it.price || 0) * (it.quantity || 1)).toLocaleString('vi-VN')} ₫</td>
      </tr>
    `
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Hóa Đơn Đơn Hàng #${order.orderCode}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 0; padding: 20px; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: 800; color: #d97706; }
        .company-info { font-size: 11px; color: #64748b; line-height: 1.4; }
        .invoice-title { text-align: center; font-size: 20px; font-weight: 800; text-transform: uppercase; margin: 20px 0 6px; }
        .invoice-code { text-align: center; color: #d97706; font-size: 13px; font-weight: 700; margin-bottom: 20px; }
        .info-grid { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #0f172a; color: #ffffff; padding: 10px; border: 1px solid #334155; font-size: 12px; }
        .total-box { margin-top: 20px; display: flex; justify-content: flex-end; }
        .total-table { width: 320px; font-size: 13px; }
        .total-table td { padding: 6px 10px; }
        .grand-total { font-size: 16px; font-weight: 800; color: #d97706; }
        .signatures { margin-top: 40px; display: flex; justify-content: space-between; text-align: center; font-size: 13px; page-break-inside: avoid; }
        .sign-space { height: 60px; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">LUXE MODELS</div>
          <div class="company-info">
            Hệ thống showroom Mô hình & Figure cao cấp<br>
            Hotline: 1900 8888 | Email: contact@luxe.vn
          </div>
        </div>
        <div style="text-align: right; font-size: 12px; color: #64748b;">
          <div><strong>Mã đơn:</strong> #${order.orderCode}</div>
          <div><strong>Ngày tạo:</strong> ${order.createdAt || currentDate}</div>
          <div><strong>Thanh toán:</strong> ${order.paymentMethod || 'COD'}</div>
        </div>
      </div>

      <div class="invoice-title">HÓA ĐƠN BÁN HÀNG & PHIẾU XUẤT KHO</div>
      <div class="invoice-code">Số: ${order.orderCode}</div>

      <div class="info-grid">
        <div>
          <div><strong>Khách hàng:</strong> ${order.fullName || 'Khách vãng lai'}</div>
          <div><strong>Số điện thoại:</strong> ${order.phone || 'N/A'}</div>
          <div><strong>Email:</strong> ${order.email || 'N/A'}</div>
        </div>
        <div>
          <div><strong>Địa chỉ giao hàng:</strong> ${order.address || ''}, ${order.district || ''}, ${order.city || ''}</div>
          <div><strong>Trạng thái:</strong> <span style="font-weight:700;color:#2563eb;">${order.status || 'Đang xử lý'}</span></div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px;">STT</th>
            <th>Tên Mô Hình / Sản Phẩm</th>
            <th style="width: 70px;">SL</th>
            <th style="width: 120px;">Đơn Giá</th>
            <th style="width: 130px;">Thành Tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml.length > 0 ? itemsHtml : `
            <tr>
              <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;">1</td>
              <td style="padding:8px;border:1px solid #e2e8f0;">Đơn hàng #${order.orderCode} (Gói mô hình Luxe)</td>
              <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;">1</td>
              <td style="padding:8px;border:1px solid #e2e8f0;text-align:right;">${(order.totalAmount || 0).toLocaleString('vi-VN')} ₫</td>
              <td style="padding:8px;border:1px solid #e2e8f0;text-align:right;font-weight:bold;">${(order.totalAmount || 0).toLocaleString('vi-VN')} ₫</td>
            </tr>
          `}
        </tbody>
      </table>

      <div class="total-box">
        <table class="total-table">
          <tr>
            <td>Tạm tính:</td>
            <td style="text-align: right;">${(order.totalAmount || 0).toLocaleString('vi-VN')} ₫</td>
          </tr>
          <tr>
            <td>Phí vận chuyển:</td>
            <td style="text-align: right; color: #16a34a;">Miễn phí</td>
          </tr>
          <tr style="border-top: 1px solid #cbd5e1;">
            <td><strong>TỔNG TIỀN:</strong></td>
            <td class="grand-total" style="text-align: right;">${(order.totalAmount || 0).toLocaleString('vi-VN')} ₫</td>
          </tr>
        </table>
      </div>

      <div class="signatures">
        <div>
          <strong>Người Mua Hàng</strong>
          <div style="font-size:11px;font-style:italic;color:#64748b;">(Ký nhận)</div>
          <div class="sign-space"></div>
        </div>
        <div>
          <strong>Nhân Viên Bán Hàng</strong>
          <div style="font-size:11px;font-style:italic;color:#64748b;">(Ký, họ tên)</div>
          <div class="sign-space"></div>
        </div>
        <div>
          <strong>Thủ Kho Xuất Hàng</strong>
          <div style="font-size:11px;font-style:italic;color:#64748b;">(Ký, đóng dấu)</div>
          <div class="sign-space"></div>
        </div>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
