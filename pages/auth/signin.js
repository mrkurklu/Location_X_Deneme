import { getCsrfToken, signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function SignIn({ csrfToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      if (result?.error) {
        setError('Giriş başarısız. Kullanıcı adı veya şifre hatalı.');
        console.error('Sign in error:', result.error);
      } else if (result?.ok) {
        console.log('Sign in successful, redirecting...');
        router.push('/');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Sign in</title></Head>
      <div className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={onSubmit} className="card w-full max-w-sm space-y-4">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <h1 className="text-xl font-semibold">Giriş Yap</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
            <input 
              className="input" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Şifre</label>
            <input 
              type="password" 
              className="input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary w-full" 
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  // Eğer kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}


