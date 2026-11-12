import { Link, useLocation } from 'react-router-dom';
import { Building2, ClipboardList, LayoutDashboard, Landmark, LogOut, Menu, Search } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Button, Toaster, Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from '../components/ui';
import { disclaimer } from '../constants.js';

const publicLinks = [
  ['About', '/about'],
  ['How it works', '/how-it-works'],
  ['Departments', '/departments'],
  ['Contact', '/contact'],
];

export default function Shell({ children }) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const logout = useAuthStore((state) => state.logout);
  const { pathname } = useLocation();
  const isLandingPage = pathname === '/';
  const isFormPage = ['/submit', '/login', '/register', '/contact', '/track'].includes(pathname);
  const isDashboard = Boolean(
    user &&
    (pathname === '/citizen' ||
      pathname.startsWith('/cmo') ||
      pathname.startsWith('/officer') ||
      pathname.startsWith('/grievances/')),
  );
  const homePath =
    user?.role === 'cmo' ? '/cmo' : user?.role === 'officer' ? '/officer' : '/citizen';
  const dashboardLinks =
    user?.role === 'cmo'
      ? [
          ['Overview', '/cmo', LayoutDashboard],
          ['Departments', '/departments', Building2],
          ['Public tracker', '/track', Search],
        ]
      : user?.role === 'officer'
        ? [['Assigned work', '/officer', ClipboardList]]
        : [
            ['My grievances', '/citizen', LayoutDashboard],
            ['Submit grievance', '/submit', ClipboardList],
            ['Track grievance', '/track', Search],
          ];
  const navLinkClass = (to) =>
    `whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${pathname === to ? 'text-primary' : 'text-slate-600'}`;

  return (
    <div className="min-h-screen bg-[#eceef1]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 px-1 py-3">
            <Link to="/" className="flex min-w-0 items-center gap-3 text-slate-950">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white">
                <Landmark className="h-6 w-6" />
              </span>
              <span className="truncate text-base font-semibold leading-tight sm:text-lg">
                Public Grievance Portal
                <span className="block text-xs font-normal text-slate-500">
                  Kerala · Public grievance services
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
              {publicLinks.map(([label, to]) => (
                <Link key={to} to={to} className={navLinkClass(to)}>
                  {label}
                </Link>
              ))}
              {user && (
                <Link to={homePath} className={navLinkClass(homePath)}>
                  Dashboard
                </Link>
              )}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              {!loading && !user && (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-slate-700">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-1 py-1.5 lg:hidden">
            <p className="text-xs text-slate-500">Kerala public services</p>
            <Drawer>
              <DrawerTrigger asChild><Button variant="outline" size="sm" aria-label="Open navigation"><Menu className="mr-2 h-4 w-4" /> Menu</Button></DrawerTrigger>
              <DrawerContent className="max-h-[85vh]">
                <DrawerHeader className="text-left">
                  <DrawerTitle>Public Grievance Portal</DrawerTitle>
                  <DrawerDescription>Find a service or return to your workspace.</DrawerDescription>
                </DrawerHeader>
                <nav className="grid gap-1 overflow-y-auto px-4 pb-6" aria-label="Mobile navigation">
                  {publicLinks.map(([label, to]) => <DrawerClose asChild key={to}><Link to={to} className={`rounded-lg px-3 py-3 text-sm font-medium ${pathname === to ? 'bg-primary/10 text-primary' : 'text-slate-700 hover:bg-slate-50'}`}>{label}</Link></DrawerClose>)}
                  {user && <DrawerClose asChild><Link to={homePath} className={`rounded-lg px-3 py-3 text-sm font-semibold ${pathname === homePath ? 'bg-primary/10 text-primary' : 'text-slate-700 hover:bg-slate-50'}`}>Dashboard</Link></DrawerClose>}
                  {!user && <DrawerClose asChild><Link to="/track" className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Track a grievance</Link></DrawerClose>}
                </nav>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>

      <div
        className={
          isDashboard
            ? 'grid w-full gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] xl:px-8'
            : isLandingPage
              ? 'w-full'
              : isFormPage
                ? 'mx-auto min-h-[75vh] w-full max-w-[1080px] px-4 py-8 sm:px-8 sm:py-10'
                : 'mx-auto min-h-[75vh] w-full max-w-[1440px] px-4 py-8 sm:px-8 sm:py-10 xl:px-12'
        }
      >
        {isDashboard && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
              <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Workspace
              </p>
              <nav
                className="flex gap-1 overflow-x-auto lg:flex-col"
                aria-label="Dashboard navigation"
              >
                {dashboardLinks.map(([label, to, Icon]) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex shrink-0 items-center gap-3 rounded px-3 py-2.5 text-sm font-medium ${pathname === to ? 'bg-blue-50 text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="px-3 text-xs font-medium text-slate-500">Signed in as</p>
                <div className="mt-3 flex items-center gap-3 rounded bg-slate-50 p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-primary">
                    {user.name
                      ?.split(' ')
                      .map((name) => name[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-900">
                      {user.name}
                    </span>
                    <span className="block text-xs capitalize text-slate-500">{user.role}</span>
                  </span>
                </div>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="mt-2 h-auto w-full justify-start gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              </div>
            </div>
          </aside>
        )}
        <main className={isDashboard ? 'min-w-0 py-1' : isLandingPage ? 'w-full' : 'min-h-[75vh]'}>
          {children}
        </main>
      </div>

      <footer className="bg-[#062b5d] text-white">
        <div className="grid h-2 grid-cols-3" aria-hidden="true">
          <span className="bg-[#e62432]" />
          <span className="bg-[#3156a6]" />
          <span className="bg-[#f2c437]" />
        </div>
        <div className="mx-auto grid max-w-[1160px] gap-6 px-4 py-7 sm:px-6 md:grid-cols-[1fr_2fr]">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-white/20 bg-white/10">
              <Landmark className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold">Public Grievance Portal</p>
              <p className="mt-1 text-xs text-blue-100/70">Kerala public services</p>
            </div>
          </div>
          <div className="text-sm leading-6 text-blue-100/80">
            <p>{disclaimer}</p>
            <p className="mt-2 text-xs">
              Background photo: Shagil Kannur, Wikimedia Commons,{' '}
              <a
                className="underline underline-offset-2 hover:text-white"
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY-SA 3.0
              </a>
              . Cropped for this site.{' '}
              <a
                className="underline underline-offset-2 hover:text-white"
                href="https://commons.wikimedia.org/wiki/File:Government_Secretariat,_Kerala.jpg"
                target="_blank"
                rel="noreferrer"
              >
                Source
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
