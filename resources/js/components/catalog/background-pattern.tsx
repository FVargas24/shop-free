import React from 'react';

export type BackgroundStyle = 'clean' | 'dots' | 'grid' | 'aurora' | 'mesh' | 'dark-slate';

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
            {/* Background Renderers */}
            {variant === 'dots' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-[#fafafa] dark:bg-zinc-950`}>
                    <div 
                        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.2]"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                            backgroundSize: '24px 24px',
                            color: '#94a3b8'
                        }}
                    />
                    <div className="absolute inset-0 bg-radial from-transparent via-background/60 to-background pointer-events-none" />
                </div>
            )}

            {variant === 'grid' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-[#fafafa] dark:bg-zinc-950`}>
                    <div 
                        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, currentColor 1px, transparent 1px),
                                linear-gradient(to bottom, currentColor 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                            color: '#94a3b8'
                        }}
                    />
                    <div className="absolute inset-0 bg-radial from-transparent via-background/50 to-background pointer-events-none" />
                </div>
            )}

            {variant === 'aurora' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-[#f8fafc] dark:bg-zinc-950 overflow-hidden`}>
                    <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-primary/15 blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                    <div className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-violet-400/15 dark:bg-violet-600/15 blur-[130px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                    <div className="absolute -bottom-[20%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-amber-300/15 dark:bg-amber-500/10 blur-[140px] pointer-events-none" />
                </div>
            )}

            {variant === 'mesh' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-gradient-to-br from-slate-50 via-zinc-100 to-stone-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950`}>
                    <div 
                        className="absolute inset-0 opacity-[0.25]"
                        style={{
                            backgroundImage: 'radial-gradient(#64748b 0.75px, transparent 0.75px)',
                            backgroundSize: '16px 16px',
                        }}
                    />
                </div>
            )}

            {variant === 'cyber-circuit' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-[#070D1F]`}>
                    <div 
                        className="absolute inset-0 opacity-[0.25]"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, rgba(56, 189, 248, 0.25) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(56, 189, 248, 0.25) 1px, transparent 1px)
                            `,
                            backgroundSize: '36px 36px',
                        }}
                    />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px]" />
                </div>
            )}

            {variant === 'midnight-glass' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-slate-950`}>
                    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/20 blur-[130px]" />
                    <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full bg-sky-400/15 blur-[140px]" />
                    <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[150px]" />
                    <div 
                        className="absolute inset-0 opacity-[0.15]"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
                            backgroundSize: '28px 28px'
                        }}
                    />
                </div>
            )}

            {variant === 'dark-slate' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-zinc-950 text-zinc-100`}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
                </div>
            )}

            {variant === 'clean' && (
                <div className={`pointer-events-none ${positionClass} inset-0 z-0 bg-[#fafafa] dark:bg-zinc-950`} />
            )}

            {/* Content Slot */}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}
