import { Head, useForm, usePage } from '@inertiajs/react';
import { Check, Sparkles, Eye, Smartphone, Monitor, Palette, Type, LayoutTemplate, Layers, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { BackgroundPattern } from '@/components/catalog/background-pattern';
import { COLOR_THEMES, FONT_THEMES, BACKGROUND_THEMES } from '@/lib/theme-config';

interface EmpresaData {
    id: number;
    nombre_empresa: string;
    slug: string;
    celular?: string;
    descripcion?: string;
    tema_color?: string;
    fondo_estilo?: string;
    tipografia?: string;
    layout_vista?: string;
    banner_url?: string;
    logo_url?: string;
}

interface ProductoMuestra {
    id: number;
    nombre: string;
    precio: number;
    stock: number | null;
    imagen: string | null;
    tallas?: string[] | null;
    colores?: { nombre: string; hex: string }[] | null;
}

interface Props {
    empresa: EmpresaData;
    productosMuestra: ProductoMuestra[];
}

export default function Personalizar({ empresa, productosMuestra }: Props) {
    const { tenant } = usePage().props as any;
    const slug = tenant?.slug || empresa.slug;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Personalizar Catálogo',
            href: `/${slug}/personalizar`,
        },
    ];

    const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');

    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        nombre_empresa: empresa.nombre_empresa || '',
        celular: empresa.celular || '',
        descripcion: empresa.descripcion || '',
        tema_color: empresa.tema_color || 'emerald',
        fondo_estilo: empresa.fondo_estilo || 'dots',
        tipografia: empresa.tipografia || 'inter',
        layout_vista: empresa.layout_vista || 'grid',
        banner_url: empresa.banner_url || '',
        logo_url: empresa.logo_url || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('personalizar.update', { empresa: slug }));
    };

    const currentTheme = COLOR_THEMES[data.tema_color] || COLOR_THEMES.emerald;
    const currentFont = FONT_THEMES[data.tipografia] || FONT_THEMES.inter;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personalizar Mi Catálogo" />

            <div className="flex flex-col lg:flex-row flex-1 h-full min-h-[calc(100vh-4rem)]">
                {/* PANEL IZQUIERDO: CONTROLES INTUITIVOS */}
                <div className="w-full lg:w-[460px] lg:shrink-0 border-r border-border bg-card p-6 overflow-y-auto space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <h1 className="text-xl font-bold tracking-tight">Personalizador Visual</h1>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Configura cómo verán tus clientes tu catálogo. Los cambios se aprecian en la vista previa al instante.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. SELECCIÓN DE FONDO SHADCN */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <Layers className="h-3.5 w-3.5" />
                                1. Estilo de Fondo (Shadcn Patterns)
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                {BACKGROUND_THEMES.map((bg) => {
                                    const isSelected = data.fondo_estilo === bg.id;
                                    return (
                                        <button
                                            type="button"
                                            key={bg.id}
                                            onClick={() => setData('fondo_estilo', bg.id)}
                                            className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                                                isSelected 
                                                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                                                    : 'border-border hover:border-zinc-300 dark:hover:border-zinc-700 bg-background'
                                            }`}
                                        >
                                            <div className={`w-full h-12 rounded-lg mb-2 overflow-hidden flex items-center justify-center text-[10px] font-mono ${bg.previewClass}`}>
                                                {bg.name.split(' ')[0]}
                                            </div>
                                            <span className="font-semibold text-xs text-foreground flex items-center justify-between w-full">
                                                {bg.name.split(' ')[0]}
                                                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground line-clamp-1">{bg.description}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. TIPOGRAFÍA */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <Type className="h-3.5 w-3.5" />
                                2. Tipografía del Catálogo
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.values(FONT_THEMES).map((font) => {
                                    const isSelected = data.tipografia === font.id;
                                    return (
                                        <button
                                            type="button"
                                            key={font.id}
                                            onClick={() => setData('tipografia', font.id)}
                                            className={`p-3 rounded-xl border text-left transition-all ${font.fontClass} ${
                                                isSelected 
                                                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                                                    : 'border-border hover:border-zinc-300 dark:hover:border-zinc-700 bg-background'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-bold">{font.name}</span>
                                                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground block font-sans">{font.category}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. COLOR DE ACENTO */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <Palette className="h-3.5 w-3.5" />
                                3. Color de tu Marca
                            </Label>
                            <div className="flex flex-wrap gap-2.5">
                                {Object.values(COLOR_THEMES).map((theme) => {
                                    const isSelected = data.tema_color === theme.id;
                                    return (
                                        <button
                                            type="button"
                                            key={theme.id}
                                            onClick={() => setData('tema_color', theme.id)}
                                            className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                                                isSelected 
                                                    ? 'border-primary ring-2 ring-primary/20 bg-muted' 
                                                    : 'border-border hover:bg-muted/50'
                                            }`}
                                        >
                                            <span 
                                                className="w-3.5 h-3.5 rounded-full shadow-xs" 
                                                style={{ backgroundColor: theme.bgHex }} 
                                            />
                                            <span>{theme.name}</span>
                                            {isSelected && <Check className="h-3 w-3 text-primary ml-1" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 4. DISPOSICIÓN / LAYOUT */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <LayoutTemplate className="h-3.5 w-3.5" />
                                4. Estilo de Visualización
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setData('layout_vista', 'grid')}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        data.layout_vista === 'grid' 
                                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                                            : 'border-border bg-background'
                                    }`}
                                >
                                    <div className="font-semibold text-xs mb-1">Cuadrícula Visual</div>
                                    <span className="text-[11px] text-muted-foreground">Tarjetas grandes con fotos destacadas</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('layout_vista', 'list')}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        data.layout_vista === 'list' 
                                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                                            : 'border-border bg-background'
                                    }`}
                                >
                                    <div className="font-semibold text-xs mb-1">Lista Compacta</div>
                                    <span className="text-[11px] text-muted-foreground">Estilo menú o lista ágil para pedidos rápidos</span>
                                </button>
                            </div>
                        </div>

                        {/* 5. DATOS BÁSICOS DEL COMERCIO */}
                        <div className="space-y-3 pt-2 border-t">
                            <div className="grid gap-1.5">
                                <Label htmlFor="nombre_empresa" className="text-xs font-semibold">Nombre Visible</Label>
                                <Input 
                                    id="nombre_empresa"
                                    value={data.nombre_empresa} 
                                    onChange={(e) => setData('nombre_empresa', e.target.value)} 
                                    placeholder="Nombre de tu negocio" 
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="celular" className="text-xs font-semibold">WhatsApp de Pedidos</Label>
                                <Input 
                                    id="celular"
                                    value={data.celular} 
                                    onChange={(e) => setData('celular', e.target.value)} 
                                    placeholder="Ej: 71234567 o +59171234567" 
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="descripcion" className="text-xs font-semibold">Slogan / Descripción Corta</Label>
                                <Input 
                                    id="descripcion"
                                    value={data.descripcion} 
                                    onChange={(e) => setData('descripcion', e.target.value)} 
                                    placeholder="Ej: Envíos a todo el país • Los mejores precios" 
                                />
                            </div>
                        </div>

                        {/* BOTÓN GUARDAR */}
                        <div className="sticky bottom-0 pt-4 pb-2 bg-card border-t border-border flex items-center justify-between gap-3">
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full gap-2 shadow-sm font-semibold"
                            >
                                <Sparkles className="h-4 w-4" />
                                {processing ? 'Guardando cambios...' : 'Guardar y Publicar'}
                            </Button>
                        </div>
                        {recentlySuccessful && (
                            <p className="text-xs font-medium text-emerald-600 text-center animate-fade-in">
                                ✓ ¡Diseño de catálogo actualizado correctamente!
                            </p>
                        )}
                    </form>
                </div>

                {/* PANEL DERECHO: VISTA PREVIA INTERACTIVA EN TIEMPO REAL */}
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 flex flex-col p-4 md:p-8 overflow-hidden">
                    {/* Header de la Vista Previa */}
                    <div className="flex items-center justify-between pb-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-background shadow-2xs gap-1.5 font-medium text-xs">
                                <Eye className="h-3.5 w-3.5 text-primary" />
                                Vista Previa en Vivo
                            </Badge>
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                                Lo que configuras a la izquierda se refleja aquí instantáneamente
                            </span>
                        </div>

                        {/* Switch Dispositivo */}
                        <div className="flex items-center bg-background border rounded-lg p-0.5 shadow-2xs">
                            <button
                                type="button"
                                onClick={() => setPreviewDevice('desktop')}
                                className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1.5 transition-all ${
                                    previewDevice === 'desktop' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Monitor className="h-3.5 w-3.5" /> Escritorio
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewDevice('mobile')}
                                className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1.5 transition-all ${
                                    previewDevice === 'mobile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Smartphone className="h-3.5 w-3.5" /> Móvil
                            </button>
                        </div>
                    </div>

                    {/* Contenedor del Mockup */}
                    <div className="flex-1 flex items-center justify-center overflow-auto p-2">
                        <div 
                            className={`transition-all duration-300 rounded-2xl shadow-2xl border border-border overflow-hidden bg-background ${
                                previewDevice === 'mobile' 
                                    ? 'w-[375px] h-[720px] max-h-[85vh]' 
                                    : 'w-full h-full max-h-[85vh]'
                            }`}
                        >
                            {/* Renderizador de Fondo y Fuente Dinámica */}
                            <BackgroundPattern isMockup={true} variant={data.fondo_estilo} className={`h-full overflow-y-auto ${currentFont.fontClass}`}>
                                <div className="p-4 sm:p-6 space-y-6">
                                    {/* Mockup Header */}
                                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                        <div>
                                            <h2 className="font-bold text-lg text-foreground tracking-tight">
                                                {data.nombre_empresa || 'Mi Tienda Online'}
                                            </h2>
                                            <p className="text-xs text-muted-foreground">
                                                {data.descripcion || 'Bienvenido a nuestro catálogo digital'}
                                            </p>
                                        </div>
                                        <div 
                                            className="px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-xs" 
                                            style={{ backgroundColor: currentTheme.bgHex }}
                                        >
                                            Pedir por WhatsApp
                                        </div>
                                    </div>

                                    {/* Mockup Búsqueda */}
                                    <div className="relative">
                                        <Input 
                                            placeholder="Buscar productos..." 
                                            className="bg-background/80 backdrop-blur-md rounded-xl text-xs h-9" 
                                            disabled 
                                        />
                                    </div>

                                    {/* Mockup Productos Grid/List */}
                                    <div className={data.layout_vista === 'list' ? 'space-y-3' : 'grid grid-cols-2 gap-3'}>
                                        {(productosMuestra.length > 0 ? productosMuestra : [
                                            { id: 1, nombre: 'Producto de Ejemplo 1', precio: 85, stock: 10, imagen: null, tallas: ['S', 'M'], colores: [{ nombre: 'Negro', hex: '#000000' }] },
                                            { id: 2, nombre: 'Producto de Ejemplo 2', precio: 120, stock: 5, imagen: null, tallas: ['Única'], colores: [{ nombre: 'Azul', hex: '#3b82f6' }] }
                                        ]).map((prod) => (
                                            <div 
                                                key={prod.id} 
                                                className={`rounded-xl border border-border/60 bg-card/80 backdrop-blur-xs p-3 transition-all ${
                                                    data.layout_vista === 'list' ? 'flex items-center gap-3' : 'space-y-2'
                                                }`}
                                            >
                                                <div className={`${data.layout_vista === 'list' ? 'w-16 h-16' : 'aspect-square w-full'} rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground overflow-hidden`}>
                                                    {prod.imagen ? <img src={prod.imagen} className="w-full h-full object-cover" /> : 'Foto'}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-xs text-foreground truncate">{prod.nombre}</h3>
                                                    <div className="font-bold text-sm mt-0.5" style={{ color: currentTheme.bgHex }}>
                                                        Bs. {Number(prod.precio).toFixed(2)}
                                                    </div>

                                                    {/* Badges de tallas/colores */}
                                                    {prod.tallas && prod.tallas.length > 0 && (
                                                        <div className="flex gap-1 mt-1">
                                                            {prod.tallas.slice(0, 2).map((t, idx) => (
                                                                <span key={idx} className="text-[9px] bg-muted px-1.5 py-0.5 rounded font-mono">
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <button 
                                                    type="button"
                                                    className="w-full py-1.5 px-3 rounded-lg text-white font-medium text-xs shadow-xs"
                                                    style={{ backgroundColor: currentTheme.bgHex }}
                                                >
                                                    Agregar +
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </BackgroundPattern>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
