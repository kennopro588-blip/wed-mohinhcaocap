'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './EventModal.module.css';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  badge: string;
  discount: string;
  desc: string;
  img: string;
  link: string;
  code?: string;
  detailText?: string;
}

interface EventModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const handleCopyCode = () => {
    if (event.code) {
      navigator.clipboard.writeText(event.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <div className={styles.imgWrap}>
          <img src={event.img} alt={event.title} className={styles.img} />
          <span className={styles.badge}>{event.badge}</span>
        </div>

        <div className={styles.content}>
          <div className={styles.date}>📅 {event.date}</div>
          <h2 className={styles.title}>{event.title}</h2>
          <p className={styles.desc}>{event.detailText || event.desc}</p>

          {event.code && (
            <div className={styles.codeBox}>
              <div>
                <div className={styles.codeLabel}>Mã Khuyến Mãi Độc Quyền</div>
                <div className={styles.codeValue}>{event.code}</div>
                {copied && <div className={styles.copiedToast}>✓ Đã sao chép mã ưu đãi thành công!</div>}
              </div>
              <button className={styles.copyBtn} onClick={handleCopyCode}>
                {copied ? 'Đã Chép' : 'Sao Chép Mã'}
              </button>
            </div>
          )}

          <Link href={event.link} className={styles.actionBtn} onClick={onClose}>
            Khám Phá & Áp Dụng Ngay →
          </Link>
        </div>
      </div>
    </div>
  );
}
