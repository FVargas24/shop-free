import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Sparkles, CheckCircle2, ShieldCheck, Zap, Store } from 'lucide-react';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Toaster } from '@/components/ui/sonner';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative min-h-screen w-full flex flex-col lg:flex-row overflow-x-hidden bg-background">
            <Toaster />

            {/* PANEL IZQUIERDO: IMAGEN FORMAL Y LIMPIA MIRACODE (50% ANCHO EN DESKTOP, MIN-H-SCREEN) */}
            <div className="relative hidden lg:flex lg:w-1/2 min-h-screen flex-col justify-between p-10 overflow-hidden border-r border-border bg-slate-100 dark:bg-zinc-950 transition-colors duration-300 shrink-0">
                {/* Imagen de Fondo Modo Claro */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 dark:opacity-0 opacity-100"
                    style={{ backgroundImage: "url('/auth-bg/Logo_Miracode_blanco.jpg')" }}
                />
                
                {/* Imagen de Fondo Modo Oscuro */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 dark:opacity-100 opacity-0"
                    style={{ backgroundImage: "url('/auth-bg/Logo_Miracode_negro.jpg')" }}
                />

                {/* Header Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-card/90 border border-border/80 p-2 shadow-sm backdrop-blur-md">
                        <img src="/logo.svg" alt="MiraCode Logo" className="size-full object-contain" />
                    </div>
                    <div>
                        <span className="text-xl font-black tracking-tight text-foreground block leading-none">MiraCode</span>
                    </div>
                </div>

                {/* Espacio central limpio para contemplar el fondo */}
                <div className="my-auto" />

                {/* Footer del Panel Izquierdo limpio */}
                <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground bg-card/85 backdrop-blur-md border border-border/60 px-4 py-2.5 rounded-2xl shadow-sm">
                    <span className="font-medium">© {new Date().getFullYear()} MiraCode</span>
                    <span className="font-semibold text-sky-600 dark:text-sky-400">Todos los derechos reservados</span>
                </div>
            </div>

            {/* PANEL DERECHO: FORMULARIO CENTRADO Y BIEN PROPORCIONADO */}
            <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto min-h-screen">
                {/* Botón flotante de cambio de tema (Sol/Luna) */}
                <div className="flex items-center justify-between w-full">
                    <Link href="/" className="flex items-center gap-2 lg:hidden">
                        <img src="/logo.svg" alt="MiraCode" className="h-8 w-8 object-contain" />
                        <span className="font-extrabold text-base tracking-tight text-foreground">MiraCode</span>
                    </Link>
                    <div className="ml-auto">
                        <AppearanceToggleDropdown />
                    </div>
                </div>

                <div className="mx-auto w-full max-w-md my-auto py-6">
                    <div className="space-y-2 text-left mb-6">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{title}</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
                    </div>

                    <div className="bg-card/95 backdrop-blur-md rounded-3xl border border-border/80 p-6 sm:p-8 shadow-xl shadow-sky-500/5">
                        {children}
                    </div>
                </div>

                {/* Footer móvil */}
                <div className="text-center text-xs text-muted-foreground pt-4">
                    <span>Protegido con encriptación de extremo a extremo</span>
                </div>
            </div>
        </div>
    );
}
