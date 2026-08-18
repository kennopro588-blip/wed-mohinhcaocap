package com.example.backend.controller.user;

import com.example.backend.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class VNPayController {

    @Autowired
    private VNPayService vnPayService;

    /**
     * POST /api/payment/vnpay/create
     * Body: { orderCode, amount, orderInfo }
     * Returns: { paymentUrl }
     */
    @PostMapping("/vnpay/create")
    public ResponseEntity<Map<String, String>> createPayment(
            @RequestBody Map<String, Object> body,
            HttpServletRequest request) {

        String orderCode = (String) body.get("orderCode");
        long   amount    = Long.parseLong(body.get("amount").toString());
        String orderInfo = (String) body.getOrDefault("orderInfo", "Thanh toan don hang LUXE " + orderCode);

        // Get client IP address
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isBlank()) ipAddress = request.getRemoteAddr();

        String paymentUrl = vnPayService.createPaymentUrl(orderCode, amount, orderInfo, ipAddress);

        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        response.put("orderCode", orderCode);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/payment/vnpay/verify?vnp_TxnRef=...&vnp_ResponseCode=...&vnp_SecureHash=...
     * Returns: { success, orderCode, amount, responseCode, message }
     */
    @GetMapping("/vnpay/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestParam Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();

        boolean signatureValid = vnPayService.verifySignature(params);
        String responseCode    = params.getOrDefault("vnp_ResponseCode", "99");
        String orderCode       = params.getOrDefault("vnp_TxnRef", "");
        String amountStr       = params.getOrDefault("vnp_Amount", "0");

        boolean success = signatureValid && "00".equals(responseCode);

        result.put("success",      success);
        result.put("orderCode",    orderCode);
        result.put("amount",       Long.parseLong(amountStr) / 100); // convert back
        result.put("responseCode", responseCode);
        result.put("message",      success ? "Thanh toán thành công" : getErrorMessage(responseCode));

        return ResponseEntity.ok(result);
    }

    private String getErrorMessage(String code) {
        return switch (code) {
            case "07" -> "Giao dịch bị nghi ngờ gian lận";
            case "09" -> "Thẻ/Tài khoản chưa đăng ký dịch vụ";
            case "10" -> "Xác thực thông tin thẻ quá 3 lần";
            case "11" -> "Hết hạn chờ thanh toán";
            case "12" -> "Thẻ/Tài khoản bị khóa";
            case "13" -> "Sai mật khẩu OTP";
            case "24" -> "Khách hàng hủy giao dịch";
            case "51" -> "Tài khoản không đủ số dư";
            case "65" -> "Vượt hạn mức giao dịch trong ngày";
            case "75" -> "Ngân hàng đang bảo trì";
            case "79" -> "Sai mật khẩu thanh toán quá số lần cho phép";
            default   -> "Giao dịch thất bại (Mã lỗi: " + code + ")";
        };
    }
}
