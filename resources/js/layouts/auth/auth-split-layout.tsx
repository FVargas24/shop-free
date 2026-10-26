import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Sparkles, CheckCircle2, ShieldCheck, Zap, Store } from 'lucide-react';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative min-h-screen w-full grid lg:grid-cols-2 overflow-hidden bg-background">
            {/* PANEL IZQUIERDO: BRANDING FORMAL CON FONDOS MIRACODE (CLARO Y OSCURO) */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-border text-foreground transition-colors duration-300">
                {/* Imagen de Fondo Modo Claro */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 dark:opacity-0 opacity-100"
                    style={{ backgroundImage: "url('/login/Logo_Miracode_blanco.jpg')" }}
                />
                
                {/* Imagen de Fondo Modo Oscuro */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 dark:opacity-100 opacity-0"
                    style={{ backgroundImage: "url('/login/Logo_Miracode_negro.jpg')" }}
                />

                {/* Capa de superposición sofisticada y gradiente para garantizar legibilidad perfecta */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-background/20 backdrop-blur-[2px]" />

                {/* Header Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex aspect-square size-11 items-center justify-center rounded-2xl bg-card/80 border border-border/80 p-2 shadow-md backdrop-blur-md">
                        <img src="/logo.svg" alt="MiraCode Logo" className="size-full object-contain" />
                    </div>
                    <div>
                        <span className="text-xl font-black tracking-tight text-foreground block leading-none">MiraCode</span>
                        <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 tracking-wider uppercase">Shop Platform</span>
                    </div>
                </div>

                {/* Hero Central con Glassmorphism moderno y formal */}
                <div className="relative z-10 max-w-md space-y-6 my-auto py-8">
                    <div className="bg-card/75 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-8 shadow-2xl space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-600 dark:text-sky-400 text-xs font-bold backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>1 Mes de Prueba Gratis</span>
                        </div>

                        <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                            Tu tienda virtual y catálogo inteligente en minutos.
                        </h2>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Diseñado para comercios modernos. Gestiona tu stock, comparte tu link personalizado y recibe pedidos automáticos directo a tu WhatsApp.
                        </p>

                        <div className="space-y-2.5 pt-2 border-t border-border/60">
                            <div className="flex items-center gap-2.5 text-xs font-medium text-foreground">
                                <div className="h-6 w-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <Zap className="h-3.5 w-3.5" />
                                </div>
                                <span>Pedidos directos y ordenados a WhatsApp</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs font-medium text-foreground">
                                <div className="h-6 w-6 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                                    <Store className="h-3.5 w-3.5" />
                                </div>
                                <span>Catálogo digital interactivo con variantes</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs font-medium text-foreground">
                                <div className="h-6 w-6 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                </div>
                                <span>Panel de administración ágil y formal</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer del Panel Izquierdo */}
                <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground bg-card/60 backdrop-blur-md border border-border/60 px-4 py-3 rounded-2xl">
                    <span className="font-medium">© {new Date().getFullYear()} MiraCode Platform</span>
                    <span className="font-semibold text-sky-600 dark:text-sky-400">Potenciando tu negocio</span>
                </div>
            </div>

            {/* PANEL DERECHO: FORMULARIO */}
            <div className="relative flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
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

                <div className="mx-auto w-full max-w-sm my-auto py-8">
                    <div className="space-y-2 text-left mb-6">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{title}</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
                    </div>

                    <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border/80 p-6 sm:p-7 shadow-xl shadow-sky-500/5">
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
