import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from '../pages/footer/footer';
import WhatsAppButton from './WhatsAppButton';

export default function PublicLayout() {
  return (
    <>
      <Suspense fallback={<div className="h-16 bg-white shadow-sm" />}>
        <Header />
      </Suspense>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
