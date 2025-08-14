import { getCsrfToken, signIn } from 'next-auth/react';
import { useState } from 'react';
import Head from 'next/head';

export default function SignIn({ csrfToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    await signIn('credentials', {
      redirect: true,
      username,
      password,
      callbackUrl: '/',
    });
  };

  return (
    <>
      <Head><title>Sign in</title></Head>
      <div className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={onSubmit} className="card w-full max-w-sm space-y-4">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <h1 className="text-xl font-semibold">Sign in</h1>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}


