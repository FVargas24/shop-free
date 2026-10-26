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
            {/* PANEL IZQUIERDO: IMAGEN FORMAL Y LIMPIA MIRACODE (MODO CLARO Y OSCURO) */}
            <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden border-r border-border transition-colors duration-300">
                {/* Imagen de Fondo Modo Claro - Llena la vista sin bordes vacíos */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 dark:opacity-0 opacity-100"
                    style={{ backgroundImage: "url('/login/Logo_Miracode_blanco.jpg')" }}
                />
                
                {/* Imagen de Fondo Modo Oscuro - Llena la vista sin bordes vacíos */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 dark:opacity-100 opacity-0"
                    style={{ backgroundImage: "url('/login/Logo_Miracode_negro.jpg')" }}
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

                {/* Espacio central limpio para que la imagen de fondo se aprecie en su totalidad */}
                <div className="my-auto" />

                {/* Footer del Panel Izquierdo limpio */}
                <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground bg-card/80 backdrop-blur-md border border-border/60 px-4 py-2.5 rounded-2xl">
                    <span className="font-medium">© {new Date().getFullYear()} MiraCode</span>
                    <span className="font-semibold text-sky-600 dark:text-sky-400">Todos los derechos reservados</span>
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
