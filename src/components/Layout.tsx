import { NavLink, Outlet } from 'react-router-dom';
import { ClipboardList, Home, Package, Store } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/mercados', label: 'Mercados', icon: Store },
  { to: '/listas', label: 'Listas', icon: ClipboardList },
  { to: '/itens', label: 'Itens', icon: Package }
];

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-200 bg-white p-6 lg:block">
        <div className="mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white">
            <ClipboardList size={26} />
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-900">Lista de Compras</h1>
          <p className="mt-1 text-sm text-slate-500">Front-end consumindo sua API Spring Boot.</p>
        </div>

        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:hidden">
          <h1 className="text-lg font-black text-slate-900">Lista de Compras</h1>
          <nav className="mt-3 flex gap-2 overflow-x-auto">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
