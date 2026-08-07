'use client';

import { useState, Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import SearchModal from './SearchModal';
import AuthModal from './AuthModal';
import ToastContainer from '../common/Toast';
import AiChatWidget from './AiChatWidget';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Suspense fallback={<div style={{ height: '70px', background: '#0d1117' }} />}>
        <Navbar onSearchOpen={() => setSearchOpen(true)} />
      </Suspense>
      <main style={{ paddingTop: 'var(--navbar-height)' }}>
        {children}
      </main>
      <Footer />
      <CartSidebar />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AuthModal />
      <ToastContainer />
      <AiChatWidget />
    </>
  );
}
