import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserMenu } from './auth/user-menu';

const links = [
  { to: '/', label: 'Destinations', end: true },
  { to: '/itineraries', label: 'Itineraries', end: false },
];

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    'block rounded px-3 py-2 md:p-0',
    isActive
      ? 'text-brand-700 font-semibold'
      : 'text-gray-700 hover:text-brand-700',
  ].join(' ');
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-brand-700">
          Trip Desk
        </Link>

        <div className="flex items-center gap-3 md:order-2">
          <UserMenu />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-controls="navbar-main"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none md:hidden"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>

        <div
          id="navbar-main"
          className={`${open ? 'block' : 'hidden'} w-full md:order-1 md:block md:w-auto`}
        >
          <ul className="mt-4 flex flex-col gap-1 font-medium md:mt-0 md:flex-row md:gap-8">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={linkClass} onClick={() => setOpen(false)}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
