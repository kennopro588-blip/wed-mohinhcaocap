'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/(user)/page.module.css';

export default function CountdownTimer() {
  // Target duration: 5 days, 12 hours, 34 minutes, 58 seconds
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 34,
    seconds: 58,
  });

  useEffect(() => {
    // End date calculation
    const targetTime = Date.now() + (5 * 86400 + 12 * 3600 + 34 * 60 + 58) * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => String(n).padStart(2, '0');

  const items = [
    { val: formatNum(timeLeft.days), label: 'Ngày' },
    { val: formatNum(timeLeft.hours), label: 'Giờ' },
    { val: formatNum(timeLeft.minutes), label: 'Phút' },
    { val: formatNum(timeLeft.seconds), label: 'Giây' },
  ];

  return (
    <div className={styles.countdown}>
      {items.map(c => (
        <div key={c.label} className={styles.countItem}>
          <span className={styles.countNum}>{c.val}</span>
          <span className={styles.countLabel}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}
