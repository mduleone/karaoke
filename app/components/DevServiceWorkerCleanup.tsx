"use client";

import { useEffect } from 'react';
import { has } from '../utils/object';

export default function DevServiceWorkerCleanup() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!has(navigator, 'serviceWorker')) return;

    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
      .catch(() => {
        /* ignore cleanup errors */
      });
  }, []);

  return null;
}
