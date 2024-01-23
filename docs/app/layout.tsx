'use client';

import Link from 'next/link';
import cx from 'classnames';
import { GithubIcon, MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { spaceGrotesk } from '@/lib/fonts';
import './globals.css';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const path = usePathname();
  return (
    <html lang="en">
      <body>
        <header className="px-6 sm:px-8 md:px-12 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-b from-indigo-100 to-blue-200 rounded-lg flex flex-col p-1.5 gap-1 relative overflow-hidden">
              <div className="w-11 h-11 absolute -right-4 -bottom-4 bg-blue-500/20 rounded-full" />
              <div className="w-7 h-1.5 rounded-full bg-gradient-to-b from-blue-300 to-blue-400 relative" />
              <div className="w-5 h-1.5 rounded-full bg-gradient-to-b from-blue-300 to-blue-400 relative" />
            </div>
            <span className={cx(`text-3xl font-bold text-blue-900`, spaceGrotesk)}>
              next-bg-image
            </span>
          </Link>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="w-10 h-10 border border-slate-200 rounded-full justify-center items-center text-slate-400 hover:bg-slate-50 transition-colors duration-200 flex sm:hidden">
              <MenuIcon />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="shadow-xl border border-slate-200 mt-2 mr-2 bg-white rounded-xl flex flex-col w-40 p-1 text-slate-500">
                <DropdownMenu.Item className="hover:bg-slate-50 rounded-lg outline-none">
                  <Link href="/demos" className="px-4 py-2 block">
                    Demos
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="hover:bg-slate-50 rounded-lg outline-none">
                  <Link
                    href="https://github.com/kiahjh/next-bg-image/blob/master/README.md"
                    className="px-4 py-2 block"
                  >
                    Docs
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="hover:bg-slate-50 rounded-lg outline-none">
                  <Link
                    href="https://github.com/kiahjh/next-bg-image"
                    className="px-4 py-2 block"
                  >
                    GitHub
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <nav className="gap-8 hidden sm:flex">
            <Link
              href="/demos"
              className={cx(
                `text-lg text-blue-900/50 hover:text-blue-900/70`,
                path === `/demos` && `!text-blue-400`,
              )}
            >
              Demos
            </Link>
            <Link
              href="https://github.com/kiahjh/next-bg-image/blob/master/README.md"
              className="text-lg text-blue-900/50 hover:text-blue-900/70"
            >
              Docs
            </Link>
            <Link
              href="https://github.com/kiahjh/next-bg-image"
              className="text-blue-900/50 hover:text-slate-700"
            >
              <GithubIcon />
            </Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
