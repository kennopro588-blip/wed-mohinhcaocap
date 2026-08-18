package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_quests")
public class UserQuest {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon", length = 20)
    private String icon;

    @Column(name = "reward_voucher_code", nullable = false, length = 50)
    private String rewardVoucherCode;

    @Column(name = "reward_title", nullable = false)
    private String rewardTitle;

    @Column(name = "progress")
    private Integer progress = 0;

    @Column(name = "max_progress")
    private Integer maxProgress = 1;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    @Column(name = "is_claimed")
    private Boolean isClaimed = false;

    public UserQuest() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getRewardVoucherCode() { return rewardVoucherCode; }
    public void setRewardVoucherCode(String rewardVoucherCode) { this.rewardVoucherCode = rewardVoucherCode; }

    public String getRewardTitle() { return rewardTitle; }
    public void setRewardTitle(String rewardTitle) { this.rewardTitle = rewardTitle; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public Integer getMaxProgress() { return maxProgress; }
    public void setMaxProgress(Integer maxProgress) { this.maxProgress = maxProgress; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean completed) { isCompleted = completed; }

    public Boolean getIsClaimed() { return isClaimed; }
    public void setIsClaimed(Boolean claimed) { isClaimed = claimed; }
}
