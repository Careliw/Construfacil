"use client";

import React, { Suspense } from 'react';
import { PrintContent } from '@/components/features/construfacil/PrintContent';
import './print.css';

export default function PrintPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center font-sans">Carregando visualização...</div>}>
      <PrintContent />
    </Suspense>
  );
}
