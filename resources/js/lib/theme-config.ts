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
        id: 'dots',
        name: 'Malla de Puntos (Dots)',
        description: 'Puntos sutiles estilo Shadcn UI.',
        previewClass: 'bg-zinc-100 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700'
    },
    {
        id: 'grid',
        name: 'Retícula Geométrica (Grid)',
        description: 'Líneas arquitectónicas modernas.',
        previewClass: 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700'
    },
    {
        id: 'aurora',
        name: 'Aurora Boreal (Gradiente)',
        description: 'Luces y resplandores suaves multicolores.',
        previewClass: 'bg-gradient-to-r from-sky-400/20 via-violet-500/20 to-pink-500/20 border border-sky-300/30'
    },
    {
        id: 'mesh',
        name: 'Malla Texturizada (Mesh)',
        description: 'Degradado neutro con textura suave.',
        previewClass: 'bg-gradient-to-br from-slate-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-950'
    },
    {
        id: 'cyber-circuit',
        name: 'Cyber Neon (Circuito)',
        description: 'Glow cibernético en azul marino y celeste.',
        previewClass: 'bg-[#0B132B] border border-cyan-400/50 text-cyan-300'
    },
    {
        id: 'midnight-glass',
        name: 'Midnight Glass (Glow)',
        description: 'Esferas luminosas en azul noche sobre fondo oscuro.',
        previewClass: 'bg-slate-950 border border-blue-500/40 text-blue-300'
    },
    {
        id: 'clean',
        name: 'Limpio & Minimalista (Clean)',
        description: 'Fondo suave sin distracciones.',
        previewClass: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
    },
    {
        id: 'dark-slate',
        name: 'Oscuro Obsidian (Dark)',
        description: 'Modo oscuro profundo y refinado.',
        previewClass: 'bg-zinc-950 text-white border border-zinc-800'
    }
];
