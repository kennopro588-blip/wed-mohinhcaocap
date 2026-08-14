'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './AiChatWidget.module.css';

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
  isContact?: boolean;
}

// History format gửi lên Gemini API
interface HistoryItem {
  role: 'user' | 'model';
  text: string;
}

const STORE_INFO = {
  name: 'LUXE Models',
  desc: 'chuyên cung cấp mô hình cao cấp chính hãng — xe hơi tỉ lệ, máy bay, tàu chiến, nhân vật anime và nhiều dòng sản phẩm độc đáo từ các thương hiệu nổi tiếng thế giới như Tamiya, Bandai, Trumpeter...',
  phone: '0909 123 456',
  email: 'bengao513@gmail.com',
  facebook: 'https://facebook.com/luxemodels',
  zalo: '0909123456',
  address: 'TP. Hồ Chí Minh, Việt Nam',
  hours: 'Thứ 2 – Thứ 7: 8:00 – 21:00',
};

const QUICK_REPLIES = [
  '📦 Sản phẩm có sẵn?',
  '🚚 Chính sách giao hàng',
  '💳 Hình thức thanh toán',
  '📞 Liên hệ chủ shop',
  '🔄 Đổi trả sản phẩm',
];

// Quick reply tĩnh cho '📞 Liên hệ chủ shop' để hiện contact card
const CONTACT_TRIGGER = '📞 Liên hệ chủ shop';

function formatText(text: string) {
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? <strong key={j} style={{ color: '#d97706' }}>{part}</strong> : part
      )}
      {i < text.split('\n').length - 1 && <br />}
    </span>
  ));
}

function ContactCard() {
  return (
    <div className={styles.contactCard}>
      <div className={styles.contactRow}>
        <span>📞</span>
        <span>Hotline: <a href={`tel:${STORE_INFO.phone}`}>{STORE_INFO.phone}</a></span>
      </div>
      <div className={styles.contactRow}>
        <span>📧</span>
        <span>Email: <a href={`mailto:${STORE_INFO.email}`}>{STORE_INFO.email}</a></span>
      </div>
      <div className={styles.contactRow}>
        <span>💬</span>
        <span>Zalo: <a href={`https://zalo.me/${STORE_INFO.zalo}`} target="_blank" rel="noreferrer">{STORE_INFO.phone}</a></span>
      </div>
      <div className={styles.contactRow}>
        <span>📘</span>
        <span>Facebook: <a href={STORE_INFO.facebook} target="_blank" rel="noreferrer">LUXE Models</a></span>
      </div>
      <div className={styles.contactRow}>
        <span>📍</span>
        <span>{STORE_INFO.address}</span>
      </div>
      <div className={styles.contactRow}>
        <span>🕐</span>
        <span>{STORE_INFO.hours}</span>
      </div>
    </div>
  );
}

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  // Lưu lịch sử hội thoại để gửi context lên Gemini
  const chatHistory = useRef<HistoryItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgId = useRef(0);

  const nextId = () => ++msgId.current;

  const addBotMessage = (text: string, isContact = false) => {
    setMessages(prev => [...prev, { id: nextId(), role: 'bot', text, isContact }]);
  };

  // Gọi Gemini AI thật qua API route
  const callGeminiAI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: chatHistory.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.reply || 'Xin lỗi, tôi không có câu trả lời lúc này. Vui lòng thử lại! 😊';
    } catch (error) {
      console.error('Gemini API call failed:', error);
      return 'Kết nối AI tạm thời gián đoạn. Bạn vui lòng liên hệ hotline **0909 123 456** để được hỗ trợ trực tiếp nhé! 📞';
    }
  };

  // Greeting flow khi mở lần đầu
  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      setShowBadge(false);
      setIsTyping(true);

      const greet1 = setTimeout(() => {
        setIsTyping(false);
        const welcomeMsg = `Xin chào bạn! 👋 Tôi là **LUXE AI** — trợ lý ảo thông minh của cửa hàng **${STORE_INFO.name}**.`;
        addBotMessage(welcomeMsg);
        // Thêm vào history
        chatHistory.current.push({ role: 'model', text: welcomeMsg });
        setIsTyping(true);
      }, 800);

      const greet2 = setTimeout(() => {
        setIsTyping(false);
        const introMsg = `🏪 Chúng tôi ${STORE_INFO.desc}.\n\nHãy hỏi tôi bất cứ điều gì về sản phẩm, giá cả, giao hàng hoặc liên hệ shop nhé! 😊`;
        addBotMessage(introMsg);
        chatHistory.current.push({ role: 'model', text: introMsg });
      }, 2200);

      return () => {
        clearTimeout(greet1);
        clearTimeout(greet2);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input khi mở
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  // Xử lý quick reply - contact card tĩnh, còn lại gửi lên Gemini
  const handleQuickReply = async (reply: string) => {
    // Hiện tin nhắn user
    setMessages(prev => [...prev, { id: nextId(), role: 'user', text: reply }]);
    chatHistory.current.push({ role: 'user', text: reply });
    setIsTyping(true);

    if (reply === CONTACT_TRIGGER) {
      // Contact card — không cần gọi AI
      setTimeout(() => {
        setIsTyping(false);
        const contactMsg = 'Dưới đây là thông tin liên hệ của **LUXE Models**, bạn có thể liên hệ qua bất kỳ kênh nào nhé! 📬';
        addBotMessage(contactMsg, true);
        chatHistory.current.push({ role: 'model', text: contactMsg });
      }, 600);
    } else {
      // Gọi Gemini AI thật
      const aiReply = await callGeminiAI(reply);
      setIsTyping(false);
      addBotMessage(aiReply);
      chatHistory.current.push({ role: 'model', text: aiReply });
    }
  };

  // Gửi tin nhắn tự do → Gemini AI thật
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isTyping) return;

    setMessages(prev => [...prev, { id: nextId(), role: 'user', text }]);
    chatHistory.current.push({ role: 'user', text });
    setInputText('');
    setIsTyping(true);

    const aiReply = await callGeminiAI(text);
    setIsTyping(false);
    addBotMessage(aiReply);
    chatHistory.current.push({ role: 'model', text: aiReply });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className={styles.chatPanel} role="dialog" aria-label="LUXE AI Chat">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>🤖</div>
              <div className={styles.onlineDot} />
            </div>
            <div className={styles.headerInfo}>
              <div className={styles.headerName}>LUXE AI Assistant</div>
              <div className={styles.headerStatus}>
                <span>●</span> Powered by Gemini AI
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Đóng chat">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messagesArea}>
            {messages.map(msg => (
              <div key={msg.id} className={`${styles.messageBubble} ${styles[msg.role]}`}>
                {msg.role === 'bot' && (
                  <div className={styles.botAvatar}>🤖</div>
                )}
                <div className={styles.bubbleText}>
                  {formatText(msg.text)}
                  {msg.isContact && <ContactCard />}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className={`${styles.messageBubble} ${styles.bot}`}>
                <div className={styles.botAvatar}>🤖</div>
                <div className={styles.typingDots}>
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick action buttons */}
          {hasOpened && !isTyping && (
            <div className={styles.quickActions}>
              {QUICK_REPLIES.map(reply => (
                <button
                  key={reply}
                  className={styles.quickBtn}
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className={styles.inputArea}>
            <input
              ref={inputRef}
              type="text"
              className={styles.chatInput}
              placeholder="Hỏi LUXE AI bất cứ điều gì..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={500}
              disabled={isTyping}
            />
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              aria-label="Gửi tin nhắn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        id="ai-chat-button"
        className={`${styles.chatButton} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Mở chat hỗ trợ AI"
        title="Chat với LUXE AI"
      >
        {!showBadge || isOpen ? null : <div className={styles.notifBadge}>1</div>}
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 13.9 2.52 15.67 3.43 17.18L2 22L6.82 20.57C8.33 21.48 10.1 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="8" cy="12" r="1.2" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.2" fill="currentColor"/>
            <circle cx="16" cy="12" r="1.2" fill="currentColor"/>
          </svg>
        )}
      </button>
    </>
  );
}
