import React from 'react';

export type BackgroundStyle = 'clean' | 'dots' | 'grid' | 'cross-grid' | 'aurora' | 'mesh' | 'beams' | 'wave';

interface BackgroundPatternProps {
    variant?: BackgroundStyle | string;
    className?: string;
    children?: React.ReactNode;
    isMockup?: boolean;
}

export function BackgroundPattern({ variant = 'dots', className = '', children, isMockup = false }: BackgroundPatternProps) {
    const positionClass = isMockup ? 'absolute' : 'fixed';

    return (
        <div className={`relative ${isMockup ? 'h-full w-full' : 'min-h-screen w-full'} transition-colors duration-500 ${className}`}>
            {/* Background Renderers - 100% Adaptables a Modo Claro y Oscuro */}
            
            {/* 1. MALLA DE PUNTOS (DOTS) */}
            {variant === 'dots' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-background`}>
                    <div 
                        className="absolute inset-0 opacity-[0.45] dark:opacity-[0.25]"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                            backgroundSize: '24px 24px',
                            color: 'hsl(var(--muted-foreground))'
                        }}
                    />
                    <div className="absolute inset-0 bg-radial from-transparent via-background/40 to-background pointer-events-none" />
                </div>
            )}

            {/* 2. RETÍCULA GEOMÉTRICA (GRID) */}
            {variant === 'grid' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-background`}>
                    <div 
                        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.20]"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, currentColor 1px, transparent 1px),
                                linear-gradient(to bottom, currentColor 1px, transparent 1px)
                            `,
                            backgroundSize: '36px 36px',
                            color: 'hsl(var(--border))'
                        }}
                    />
                    <div className="absolute inset-0 bg-radial from-transparent via-background/30 to-background pointer-events-none" />
                </div>
            )}

            {/* 3. CRUCES PLUS (+ GRID SHADCN) */}
            {variant === 'cross-grid' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-background`}>
                    <div 
                        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.2]"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle, currentColor 1.5px, transparent 1.5px),
                                linear-gradient(to right, transparent calc(100% - 1px), currentColor 1px),
                                linear-gradient(to bottom, transparent calc(100% - 1px), currentColor 1px)
                            `,
                            backgroundSize: '40px 40px',
                            color: 'hsl(var(--border))'
                        }}
                    />
                    <div className="absolute inset-0 bg-radial from-transparent via-background/40 to-background pointer-events-none" />
                </div>
            )}

            {/* 4. AURORA BOREAL (Luz y Sombra Adaptable) */}
            {variant === 'aurora' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-background overflow-hidden`}>
                    <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-sky-400/20 dark:bg-sky-500/15 blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                    <div className="absolute top-[25%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-violet-400/20 dark:bg-violet-600/15 blur-[130px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                    <div className="absolute -bottom-[20%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-rose-300/20 dark:bg-pink-600/15 blur-[140px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                </div>
            )}

            {/* 5. GRADIENTE MESH FLUIDO */}
            {variant === 'mesh' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-gradient-to-br from-slate-100/80 via-background to-sky-50/50 dark:from-zinc-950 dark:via-background dark:to-slate-950/80`}>
                    <div 
                        className="absolute inset-0 opacity-[0.3] dark:opacity-[0.15]"
                        style={{
                            backgroundImage: 'radial-gradient(currentColor 0.75px, transparent 0.75px)',
                            backgroundSize: '16px 16px',
                            color: 'hsl(var(--muted-foreground))'
                        }}
                    />
                </div>
            )}

            {/* 6. HACES DE LUZ (BEAMS) */}
            {variant === 'beams' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-background`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.22),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.18),transparent_70%)] pointer-events-none" />
                    <div 
                        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.15]"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, currentColor 1px, transparent 1px),
                                linear-gradient(to bottom, currentColor 1px, transparent 1px)
                            `,
                            backgroundSize: '48px 48px',
                            color: 'hsl(var(--border))'
                        }}
                    />
                    <div className="absolute inset-0 bg-radial from-transparent via-background/40 to-background pointer-events-none" />
                </div>
            )}

            {/* 7. ONDAS & ESFERAS GLOW */}
            {variant === 'wave' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-background overflow-hidden`}>
                    <div className="absolute -top-32 left-1/4 w-[450px] h-[450px] rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-[120px] pointer-events-none" />
                    <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full bg-sky-400/15 dark:bg-sky-500/10 blur-[130px] pointer-events-none" />
                    <div className="absolute -bottom-32 left-10 w-[450px] h-[450px] rounded-full bg-indigo-400/15 dark:bg-indigo-500/10 blur-[140px] pointer-events-none" />
                </div>
            )}

            {/* 8. LIMPIO & MINIMAL (CLEAN) */}
            {variant === 'clean' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-background`} />
            )}

            {/* Content Slot */}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}
