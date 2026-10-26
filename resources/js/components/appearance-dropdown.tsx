import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    // Instant toggle between light and dark with 1 single click
    const toggleTheme = () => {
        const isDark = document.documentElement.classList.contains('dark') || appearance === 'dark';
        const nextMode = isDark ? 'light' : 'dark';
        updateAppearance(nextMode);
    };

    const isDark = appearance === 'dark' || (appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className={className} {...props}>
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                className="h-9 w-9 rounded-xl border border-border/80 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-foreground transition-all duration-200"
            >
                {isDark ? (
                    <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
                ) : (
                    <Moon className="h-4 w-4 text-sky-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
                )}
                <span className="sr-only">Cambiar tema</span>
            </Button>
        </div>
    );
}
