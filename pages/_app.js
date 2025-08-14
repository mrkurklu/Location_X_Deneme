import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = stored ? stored === 'dark' : prefersDark;
    setIsDark(shouldDark);
    document.documentElement.classList.toggle('dark', shouldDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    }
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <div className="min-h-screen">
          <Component {...pageProps} toggleTheme={toggleTheme} isDark={isDark} />
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </SessionProvider>
  );
}


