package com.example.backend.controller.user;

import com.example.backend.entity.UserQuest;
import com.example.backend.entity.UserSubscription;
import com.example.backend.entity.UserVoucher;
import com.example.backend.entity.Voucher;
import com.example.backend.repository.UserQuestRepository;
import com.example.backend.repository.UserSubscriptionRepository;
import com.example.backend.repository.UserVoucherRepository;
import com.example.backend.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/user")
public class VoucherController {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private UserVoucherRepository userVoucherRepository;

    @Autowired
    private UserQuestRepository userQuestRepository;

    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;

    /**
     * GET /api/user/vouchers/my
     * Return list of active vouchers currently owned by the user
     */
    @GetMapping("/vouchers/my")
    public List<UserVoucher> getMyVouchers(@RequestParam(defaultValue = "1") Long userId) {
        return userVoucherRepository.findByUserIdAndIsUsedFalse(userId);
    }

    /**
     * GET /api/user/quests
     * Return list of user quests
     */
    @GetMapping("/quests")
    public List<UserQuest> getQuests() {
        return userQuestRepository.findAll();
    }

    /**
     * POST /api/user/quests/{id}/claim
     * Claim reward voucher from completed quest and add to user wallet
     */
    @PostMapping("/quests/{id}/claim")
    public ResponseEntity<Map<String, Object>> claimQuestReward(
            @PathVariable String id,
            @RequestParam(defaultValue = "1") Long userId) {
        Optional<UserQuest> opt = userQuestRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UserQuest quest = opt.get();
        if (Boolean.TRUE.equals(quest.getIsClaimed())) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Nhiệm vụ này bạn đã nhận thưởng rồi!");
            return ResponseEntity.badRequest().body(err);
        }

        quest.setIsClaimed(true);
        quest.setIsCompleted(true);
        quest.setProgress(quest.getMaxProgress());
        userQuestRepository.save(quest);

        // Add voucher to user's wallet
        Optional<Voucher> vOpt = voucherRepository.findByCode(quest.getRewardVoucherCode());
        if (vOpt.isPresent()) {
            Voucher v = vOpt.get();
            UserVoucher uv = new UserVoucher();
            uv.setUserId(userId);
            uv.setCode(v.getCode());
            uv.setTitle(v.getTitle());
            uv.setDiscountType(v.getDiscountType());
            uv.setDiscountValue(v.getDiscountValue());
            uv.setMinOrder(v.getMinOrder());
            uv.setMaxDiscount(v.getMaxDiscount());
            uv.setTag("NHIỆM VỤ 🎯");
            uv.setAcquiredFrom("QUEST_" + quest.getId());
            userVoucherRepository.save(uv);
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Nhận thưởng thành công! Mã " + quest.getRewardVoucherCode() + " đã được thêm vào ví voucher của bạn.");
        return ResponseEntity.ok(resp);
    }

    /**
     * POST /api/user/minigame/spin
     * Play lucky wheel minigame and receive voucher
     */
    @PostMapping("/minigame/spin")
    public ResponseEntity<Map<String, Object>> spinLuckyWheel(@RequestParam(defaultValue = "1") Long userId) {
        String code = "LUCKYWHEEL";
        Optional<Voucher> vOpt = voucherRepository.findByCode(code);

        if (vOpt.isPresent()) {
            Voucher v = vOpt.get();
            UserVoucher uv = new UserVoucher();
            uv.setUserId(userId);
            uv.setCode(v.getCode());
            uv.setTitle(v.getTitle());
            uv.setDiscountType(v.getDiscountType());
            uv.setDiscountValue(v.getDiscountValue());
            uv.setMinOrder(v.getMinOrder());
            uv.setMaxDiscount(v.getMaxDiscount());
            uv.setTag("MAY MẮN 🎲");
            uv.setAcquiredFrom("LUCKY_WHEEL");
            userVoucherRepository.save(uv);
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("voucherCode", code);
        resp.put("message", "🎉 Chúc mừng bạn đã quay trúng Voucher Giảm 200.000₫ (Mã: LUCKYWHEEL)!");
        return ResponseEntity.ok(resp);
    }

    /**
     * GET /api/user/subscriptions
     * Get active VIP membership plans
     */
    @GetMapping("/subscriptions")
    public List<UserSubscription> getSubscriptions(@RequestParam(defaultValue = "1") Long userId) {
        return userSubscriptionRepository.findByUserIdAndStatus(userId, "ACTIVE");
    }

    /**
     * POST /api/user/subscriptions/buy
     * Buy 30-day VIP Pass (Unlimited Free Shipping + 15% VIP Voucher)
     */
    @PostMapping("/subscriptions/buy")
    public ResponseEntity<Map<String, Object>> buySubscription(
            @RequestParam(defaultValue = "VIP_GOLD_30") String planKey,
            @RequestParam(defaultValue = "1") Long userId) {

        LocalDate now = LocalDate.now();
        LocalDate end = now.plusDays(30);

        UserSubscription sub = new UserSubscription();
        sub.setUserId(userId);
        sub.setPlanKey(planKey);
        sub.setPlanName("Gói Hội Viên Gold VIP (30 Ngày)");
        sub.setPrice(new BigDecimal("99000"));
        sub.setDurationDays(30);
        sub.setStartDate(now.toString());
        sub.setEndDate(end.toString());
        sub.setStatus("ACTIVE");
        sub.setBenefits("Miễn phí vận chuyển toàn bộ đơn hàng trong 30 ngày + Tặng Voucher VIP 15% + Quyền ưu tiên đặt trước Limited Edition");
        userSubscriptionRepository.save(sub);

        // Grant 2 exclusive VIP vouchers
        // 1. Unlimited Freeship
        UserVoucher freeshipVoucher = new UserVoucher();
        freeshipVoucher.setUserId(userId);
        freeshipVoucher.setCode("VIPFREESHIP");
        freeshipVoucher.setTitle("Freeship Không Giới Hạn (Gói VIP 30 Ngày)");
        freeshipVoucher.setDiscountType("SHIPPING");
        freeshipVoucher.setDiscountValue(new BigDecimal("50000"));
        freeshipVoucher.setMinOrder(BigDecimal.ZERO);
        freeshipVoucher.setTag("VIP PASS 👑");
        freeshipVoucher.setAcquiredFrom("VIP_MEMBERSHIP");
        userVoucherRepository.save(freeshipVoucher);

        // 2. VIP 15%
        UserVoucher goldVoucher = new UserVoucher();
        goldVoucher.setUserId(userId);
        goldVoucher.setCode("VIPGOLD15");
        goldVoucher.setTitle("Đặc Quyền Gói VIP - Giảm 15%");
        goldVoucher.setDiscountType("PERCENT");
        goldVoucher.setDiscountValue(new BigDecimal("15"));
        goldVoucher.setMinOrder(new BigDecimal("3000000"));
        goldVoucher.setMaxDiscount(new BigDecimal("1500000"));
        goldVoucher.setTag("GOLD VIP ⭐");
        goldVoucher.setAcquiredFrom("VIP_MEMBERSHIP");
        userVoucherRepository.save(goldVoucher);

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "🎉 Đăng ký Gói Hội Viên VIP 30 Ngày thành công! Bạn đã nhận được thẻ Freeship VIP & Voucher Giảm 15%!");
        return ResponseEntity.ok(resp);
    }
}
