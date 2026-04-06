import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from '../pages/footer/footer';
import WhatsAppButton from './WhatsAppButton';

export default function
  
  PublicLayout() {
  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col w-full max-w-[100vw]">
      <Suspense fallback={<div className="h-16 bg-white shadow-sm shrink-0" />}>
        <Header />
      </Suspense>
      <main className="flex-1 min-w-0 w-full">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
