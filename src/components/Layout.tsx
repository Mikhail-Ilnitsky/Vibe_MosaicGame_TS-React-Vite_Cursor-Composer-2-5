import type { ReactNode } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LayoutProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Layout({ title, children, footer }: LayoutProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <header className="flex shrink-0 items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-6">
        <h1 className="text-xl font-light tracking-tight text-neutral-900 sm:text-2xl">
          {title}
        </h1>
        <LanguageSwitcher />
      </header>

      <main className="flex min-h-0 flex-1 flex-col px-4 pb-4 sm:px-8 sm:pb-8">
        {children}
      </main>

      {footer && (
        <footer className="shrink-0 px-4 pb-6 sm:px-8">{footer}</footer>
      )}
    </div>
  );
}
