export interface ColorTheme {
    id: string;
    name: string;
    bgHex: string;
    classColor: string;
    badgeClass: string;
    primaryHsl: string;
}

export const COLOR_THEMES: Record<string, ColorTheme> = {
    emerald: {
        id: 'emerald',
        name: 'Esmeralda Fresco',
        bgHex: '#10b981',
        classColor: 'bg-emerald-600 text-white hover:bg-emerald-700',
        badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        primaryHsl: '160 84% 39%',
    },
    indigo: {
        id: 'indigo',
        name: 'Índigo Tech',
        bgHex: '#6366f1',
        classColor: 'bg-indigo-600 text-white hover:bg-indigo-700',
        badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        primaryHsl: '239 84% 67%',
    },
    rose: {
        id: 'rose',
        name: 'Rosa Elegante',
        bgHex: '#f43f5e',
        classColor: 'bg-rose-600 text-white hover:bg-rose-700',
        badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
        primaryHsl: '350 89% 60%',
    },
    amber: {
        id: 'amber',
        name: 'Ámbar Cálido',
        bgHex: '#f59e0b',
        classColor: 'bg-amber-600 text-white hover:bg-amber-700',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        primaryHsl: '38 92% 50%',
    },
    violet: {
        id: 'violet',
        name: 'Violeta Neón',
        bgHex: '#8b5cf6',
        classColor: 'bg-violet-600 text-white hover:bg-violet-700',
        badgeClass: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
        primaryHsl: '258 90% 66%',
    },
    slate: {
        id: 'slate',
        name: 'Negro Minimal',
        bgHex: '#0f172a',
        classColor: 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900',
        badgeClass: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
        primaryHsl: '240 5.9% 10%',
    },
};

export const FONT_THEMES: Record<string, { id: string; name: string; fontClass: string; category: string; description: string }> = {
    inter: {
        id: 'inter',
        name: 'Inter',
        fontClass: 'font-[Inter,sans-serif]',
        category: 'Moderna & Tech',
        description: 'La fuente más limpia y legible en pantallas digitales.'
    },
    outfit: {
        id: 'outfit',
        name: 'Outfit',
        fontClass: 'font-[Outfit,sans-serif]',
        category: 'Fresca & Dinámica',
        description: 'Estilo redondeado, vibrante y cercano para marcas activas.'
    },
    poppins: {
        id: 'poppins',
        name: 'Poppins',
        fontClass: 'font-[Poppins,sans-serif]',
        category: 'Geométrica & Enérgica',
        description: 'Títulos llamativos con una estética moderna e internacional.'
    },
    dmsans: {
        id: 'dmsans',
        name: 'DM Sans',
        fontClass: 'font-[\'DM_Sans\',sans-serif]',
        category: 'Minimalista & Elegante',
        description: 'Proporciones balanceadas ideales para tiendas boutique.'
    },
    playfair: {
        id: 'playfair',
        name: 'Playfair Display',
        fontClass: 'font-[\'Playfair_Display\',serif]',
        category: 'Elegante & Boutique',
        description: 'Tipografía serif sofisticada para moda, joyas y gastronomía.'
    },
    cinzel: {
        id: 'cinzel',
        name: 'Cinzel Royal',
        fontClass: 'font-[Cinzel,serif]',
        category: 'Lujo & Distinción',
        description: 'Acabados clásicos romanos inspirados en marcas de alta gama.'
    },
    jakarta: {
        id: 'jakarta',
        name: 'Plus Jakarta Sans',
        fontClass: 'font-[\'Plus_Jakarta_Sans\',sans-serif]',
        category: 'Corporativa & Premium',
        description: 'Limpia, geométrica y con presencia comercial de vanguardia.'
    },
};

export const BACKGROUND_THEMES = [
    {
        id: 'aurora',
        name: 'Aurora Boreal',
        description: 'Auras suaves multicolores adaptables en luz y sombra.',
        previewClass: 'bg-gradient-to-r from-sky-400/20 via-violet-500/20 to-pink-500/20 border border-sky-300/40'
    },
    {
        id: 'dots',
        name: 'Malla de Puntos (Dots)',
        description: 'Micro-puntos geométricos clásicos de Shadcn UI.',
        previewClass: 'bg-zinc-100 dark:bg-zinc-900 border border-dashed border-zinc-400 dark:border-zinc-700'
    },
    {
        id: 'grid',
        name: 'Retícula Geométrica (Grid)',
        description: 'Líneas arquitectónicas modernas, limpias y elegantes.',
        previewClass: 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700'
    },
    {
        id: 'cross-grid',
        name: 'Cruces Plus (+ Grid)',
        description: 'Patrón de cruces sutiles de diseño suizo y Shadcn.',
        previewClass: 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-400 dark:border-zinc-700 font-mono text-center'
    },
    {
        id: 'mesh',
        name: 'Gradiente Mesh Fluido',
        description: 'Degradado suave con micro-textura que resalta productos.',
        previewClass: 'bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-50 dark:from-zinc-900 dark:via-slate-900 dark:to-zinc-950 border border-border'
    },
    {
        id: 'beams',
        name: 'Haces de Luz (Beams)',
        description: 'Resplandor superior central que ilumina la tienda.',
        previewClass: 'bg-gradient-to-b from-sky-200/50 to-transparent dark:from-sky-900/30 dark:to-transparent border border-sky-300/40'
    },
    {
        id: 'wave',
        name: 'Ondas & Esferas Glow',
        description: 'Gradientes radiales orgánicos y armónicos.',
        previewClass: 'bg-gradient-to-tr from-emerald-100/60 via-sky-100/40 to-blue-100/50 dark:from-emerald-950/40 dark:via-sky-950/30 dark:to-blue-950/40 border border-emerald-300/40'
    },
    {
        id: 'clean',
        name: 'Limpio & Minimal (Clean)',
        description: 'Superficie lisa y balanceada que no compite con las fotos.',
        previewClass: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
    }
];
