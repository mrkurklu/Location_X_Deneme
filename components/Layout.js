import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Layout({ children, toggleTheme, isDark }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Location X</h2>
          <p className="text-xs text-gray-500">Management System</p>
        </div>
        <nav className="space-y-1">
          <Link href="/" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Dashboard</Link>
          <Link href="/stock" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Manage Stock</Link>
          <Link href="/sales" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">View Sales</Link>
          <Link href="/sales/management" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Sales Management</Link>
          <Link href="/users" className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Manage Users</Link>
        </nav>
      </aside>
      <main className="p-4">
        <header className="mb-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-2">
            <button className="btn-secondary" onClick={toggleTheme}>{isDark ? 'Light' : 'Dark'}</button>
            {session && (
              <>
                <span className="text-sm">{session.user?.username} ({session.user?.role})</span>
                <button className="btn-primary" onClick={() => signOut()}>Logout</button>
              </>
            )}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}


