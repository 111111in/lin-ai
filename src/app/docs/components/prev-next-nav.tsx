// src/app/docs/components/prev-next-nav.tsx
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PageLink {
  path: string;
  title: string;
}

interface PrevNextNavProps {
  prev: PageLink | null;
  next: PageLink | null;
}

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  if (!prev && !next) {
    return null; // Don't render anything if neither link exists
  }

  return (
    <nav className="mt-16 flex w-full items-center justify-between gap-6">
      {/* 顶部分隔线 */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -mt-8"></div>

      {prev ? (
        <Link
          href={{ pathname: prev.path }}
          className="inline-flex flex-1 items-center gap-4 p-6 rounded-2xl border-2 border-border/50 hover:border-primary/50 bg-gradient-to-br from-card/50 to-card hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 group relative overflow-hidden shadow-lg hover:shadow-xl hover:shadow-primary/20"
        >
          {/* 悬停光效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

          <div className="p-3 rounded-xl bg-muted/50 group-hover:bg-primary/20 transition-all duration-300 relative z-10">
            <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex flex-col text-left overflow-hidden flex-1 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">
              Previous
            </span>
            <span className="truncate text-foreground group-hover:text-primary font-bold text-base transition-colors">
              {prev.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex-1"></div>
      )}

      {next ? (
        <Link
          href={{ pathname: next.path }}
          className="inline-flex flex-1 items-center justify-end gap-4 p-6 rounded-2xl border-2 border-border/50 hover:border-secondary/50 bg-gradient-to-br from-card/50 to-card hover:from-secondary/5 hover:to-accent/5 transition-all duration-300 group relative overflow-hidden shadow-lg hover:shadow-xl hover:shadow-secondary/20"
        >
          {/* 悬停光效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

          <div className="flex flex-col text-right overflow-hidden flex-1 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">
              Next
            </span>
            <span className="truncate text-foreground group-hover:text-secondary font-bold text-base transition-colors">
              {next.title}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-muted/50 group-hover:bg-secondary/20 transition-all duration-300 relative z-10">
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-secondary transition-colors" />
          </div>
        </Link>
      ) : (
        <div className="flex-1"></div>
      )}
    </nav>
  );
}
