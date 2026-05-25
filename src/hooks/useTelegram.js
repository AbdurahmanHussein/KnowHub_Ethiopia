import { useState, useEffect } from 'react';

export function useTelegram() {
  const [tgData, setTgData] = useState({
    isTelegram: false,
    user: null,
    isReady: false,
  });

  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        setTgData({
          isTelegram: true,
          user: tg.initDataUnsafe?.user || null,
          isReady: true,
        });
      } else {
        setTgData(prev => ({ ...prev, isReady: true }));
      }
    } catch {
      setTgData(prev => ({ ...prev, isReady: true }));
    }
  }, []);

  return tgData;
}
