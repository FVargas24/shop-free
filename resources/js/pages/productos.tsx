import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Package, Trash2, Edit, X, Palette, Sparkles } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { type BreadcrumbItem } from '@/types';

interface ColorVariant {
    nombre: string;
    hex: string;
}

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number | null;
    imagen: string | null;
    tallas?: string[] | null;
    colores?: ColorVariant[] | null;
}

interface Props {
    productos: Producto[];
}

const PRESET_TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42', 'Única'];
const PRESET_COLORES = [
    { nombre: 'Negro', hex: '#000000' },
    { nombre: 'Blanco', hex: '#ffffff' },
    { nombre: 'Rojo', hex: '#ef4444' },
    { nombre: 'Azul', hex: '#3b82f6' },
    { nombre: 'Verde', hex: '#10b981' },
    { nombre: 'Amarillo', hex: '#f59e0b' },
    { nombre: 'Rosa', hex: '#ec4899' },
    { nombre: 'Gris', hex: '#64748b' },
    { nombre: 'Beige', hex: '#d6c5b3' },
];

interface ProductFormData {
    [key: string]: any;
    nombre: string;
    precio: string;
    stock: string;
    imagen: File | null;
    tallas: string[];
    colores: ColorVariant[];
}

export default function Productos({ productos }: Props) {
    const { tenant } = usePage().props as any;
    const slug = tenant?.slug || '';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Productos',
            href: `/${slug}/productos`,
        },
    ];

    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

    // Custom input for new talla & color
    const [customTalla, setCustomTalla] = useState('');
    const [customColorName, setCustomColorName] = useState('');
    const [customColorHex, setCustomColorHex] = useState('#000000');

    const { data, setData, post, processing, reset, errors } = useForm<ProductFormData>({
        nombre: '',
        precio: '',
        stock: '',
        imagen: null,
        tallas: [],
        colores: [],
    });

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        setOpen(true);
    };

    const toggleTalla = (talla: string) => {
        if (data.tallas.includes(talla)) {
            setData('tallas', data.tallas.filter(t => t !== talla));
        } else {
            setData('tallas', [...data.tallas, talla]);
        }
    };

    const addCustomTalla = () => {
        if (customTalla.trim() && !data.tallas.includes(customTalla.trim())) {
            setData('tallas', [...data.tallas, customTalla.trim()]);
            setCustomTalla('');
        }
    };

    const toggleColor = (color: ColorVariant) => {
        const exists = data.colores.some(c => c.nombre.toLowerCase() === color.nombre.toLowerCase());
        if (exists) {
            setData('colores', data.colores.filter(c => c.nombre.toLowerCase() !== color.nombre.toLowerCase()));
        } else {
            setData('colores', [...data.colores, color]);
        }
    };

    const addCustomColor = () => {
        if (customColorName.trim()) {
            const exists = data.colores.some(c => c.nombre.toLowerCase() === customColorName.trim().toLowerCase());
            if (!exists) {
                setData('colores', [...data.colores, { nombre: customColorName.trim(), hex: customColorHex }]);
                setCustomColorName('');
            }
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('productos.store', { empresa: slug }), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    const emptyCards = Array.from({ length: Math.max(0, 6 - productos.length) });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Productos" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Mis Productos</h1>
                    <p className="text-muted-foreground text-sm">Gestiona tus productos y variantes opcionales (tallas y colores) de forma rápida.</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <Button onClick={openCreateModal} className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Agregar producto
                    </Button>

                    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                        <form onSubmit={submit} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>Nuevo Producto</DialogTitle>
                                <DialogDescription>
                                    Crea un producto para tu catálogo. Las tallas y colores son 100% opcionales.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-2">
                                {/* Nombre */}
                                <div className="grid gap-1.5">
                                    <Label htmlFor="nombre" className="font-semibold text-xs">Nombre del Producto *</Label>
                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        placeholder="Ej: Polera Oversize, Zapatillas Urbanas, etc."
                                        required
                                    />
                                    {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
                                </div>

                                {/* Precio y Stock */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="precio" className="font-semibold text-xs">Precio (Bs.) *</Label>
                                        <Input
                                            id="precio"
                                            type="number"
                                            step="0.01"
                                            value={data.precio}
                                            onChange={(e) => setData('precio', e.target.value)}
                                            placeholder="0.00"
                                            required
                                        />
                                        {errors.precio && <p className="text-xs text-destructive">{errors.precio}</p>}
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="stock" className="font-semibold text-xs">Stock Disponible</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            placeholder="Ilimitado o Ej: 15"
                                        />
                                        {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
                                    </div>
                                </div>

                                {/* Imagen */}
                                <div className="grid gap-1.5">
                                    <Label htmlFor="imagen" className="font-semibold text-xs">Foto del Producto</Label>
                                    <Input
                                        id="imagen"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('imagen', e.target.files ? e.target.files[0] : null)}
                                        className="cursor-pointer file:cursor-pointer"
                                    />
                                    {errors.imagen && <p className="text-xs text-destructive">{errors.imagen}</p>}
                                </div>

                                {/* SECCIÓN VARIANTES OPCIONALES: Tallas */}
                                <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-3.5 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="font-semibold text-xs flex items-center gap-1.5">
                                            <span>📏 Tallas disponibles</span>
                                            <span className="text-[10px] font-normal text-muted-foreground">(Opcional)</span>
                                        </Label>
                                        {data.tallas.length > 0 && (
                                            <span className="text-[11px] text-primary font-medium">{data.tallas.length} seleccionadas</span>
                                        )}
                                    </div>

                                    {/* Presets de tallas */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {PRESET_TALLAS.map(talla => {
                                            const isSelected = data.tallas.includes(talla);
                                            return (
                                                <button
                                                    type="button"
                                                    key={talla}
                                                    onClick={() => toggleTalla(talla)}
                                                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                                                        isSelected
                                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                                            : 'bg-background border border-input hover:bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {talla}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Agregar talla personalizada */}
                                    <div className="flex gap-2 pt-1">
                                        <Input
                                            value={customTalla}
                                            onChange={(e) => setCustomTalla(e.target.value)}
                                            placeholder="Otra talla (ej: 44, XL especial)"
                                            className="h-8 text-xs"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addCustomTalla();
                                                }
                                            }}
                                        />
                                        <Button type="button" variant="secondary" size="sm" onClick={addCustomTalla} className="h-8 text-xs px-2.5">
                                            + Agregar
                                        </Button>
                                    </div>
                                </div>

                                {/* SECCIÓN VARIANTES OPCIONALES: Colores */}
                                <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-3.5 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="font-semibold text-xs flex items-center gap-1.5">
                                            <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>🎨 Colores disponibles</span>
                                            <span className="text-[10px] font-normal text-muted-foreground">(Opcional)</span>
                                        </Label>
                                        {data.colores.length > 0 && (
                                            <span className="text-[11px] text-primary font-medium">{data.colores.length} seleccionados</span>
                                        )}
                                    </div>

                                    {/* Presets de colores */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {PRESET_COLORES.map(color => {
                                            const isSelected = data.colores.some(c => c.nombre.toLowerCase() === color.nombre.toLowerCase());
                                            return (
                                                <button
                                                    type="button"
                                                    key={color.nombre}
                                                    onClick={() => toggleColor(color)}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                                                        isSelected
                                                            ? 'bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/30'
                                                            : 'bg-background border border-input hover:bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    <span 
                                                        className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-xs" 
                                                        style={{ backgroundColor: color.hex }}
                                                    />
                                                    {color.nombre}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Agregar color personalizado */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="color"
                                            value={customColorHex}
                                            onChange={(e) => setCustomColorHex(e.target.value)}
                                            className="w-8 h-8 rounded-md border border-input cursor-pointer bg-transparent"
                                            title="Elegir tono exacto"
                                        />
                                        <Input
                                            value={customColorName}
                                            onChange={(e) => setCustomColorName(e.target.value)}
                                            placeholder="Nombre del color (ej: Celeste Pastel)"
                                            className="h-8 text-xs flex-1"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addCustomColor();
                                                }
                                            }}
                                        />
                                        <Button type="button" variant="secondary" size="sm" onClick={addCustomColor} className="h-8 text-xs px-2.5">
                                            + Agregar
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={processing}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    {processing ? 'Guardando...' : 'Crear Producto'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="px-4 md:px-8 pb-12">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {productos.map((producto) => (
                        <Card key={producto.id} className="overflow-hidden transition-all hover:shadow-lg border-zinc-200 dark:border-zinc-800 group">
                            <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden">
                                {producto.imagen ? (
                                    <img 
                                        src={producto.imagen} 
                                        alt={producto.nombre} 
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
                                        <Package className="h-12 w-12" />
                                        <span className="text-xs">Sin imagen</span>
                                    </div>
                                )}
                                
                                {producto.stock !== null && (
                                    <Badge variant="secondary" className="absolute top-3 right-3 backdrop-blur-md bg-background/80 text-xs">
                                        Stock: {producto.stock}
                                    </Badge>
                                )}
                            </div>

                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-base font-semibold line-clamp-1">{producto.nombre}</CardTitle>
                                <div className="text-lg font-bold text-primary">
                                    Bs. {Number(producto.precio).toFixed(2)}
                                </div>
                            </CardHeader>

                            <CardContent className="px-4 pb-3 pt-0 space-y-2">
                                {/* Tallas Chips */}
                                {producto.tallas && Array.isArray(producto.tallas) && producto.tallas.length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase mr-1">Tallas:</span>
                                        {producto.tallas.map((t, idx) => (
                                            <span key={idx} className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-medium">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Colores Dots */}
                                {producto.colores && Array.isArray(producto.colores) && producto.colores.length > 0 && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase mr-1">Colores:</span>
                                        {producto.colores.map((c, idx) => (
                                            <span 
                                                key={idx} 
                                                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs" 
                                                style={{ backgroundColor: c.hex }}
                                                title={c.nombre}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="p-4 pt-0 flex gap-2 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 text-xs gap-1.5 h-8"
                                    onClick={() => {
                                        // Abre diálogo de edición
                                    }}
                                >
                                    <Edit className="h-3.5 w-3.5" /> Editar
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2.5"
                                    onClick={() => {
                                        if (confirm(`¿Eliminar ${producto.nombre}?`)) {
                                            post(route('productos.destroy', { empresa: slug, producto: producto.id }), {
                                                method: 'delete',
                                            });
                                        }
                                    }}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {emptyCards.map((_, i) => (
                        <Card key={`empty-${i}`} className="border-dashed flex flex-col items-center justify-center p-8 bg-muted/20 opacity-60 rounded-xl">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <Skeleton className="h-4 w-2/3 mb-2" />
                            <Skeleton className="h-3 w-1/2" />
                            <div className="mt-6 w-full flex gap-2">
                                <Skeleton className="h-8 flex-1" />
                                <Skeleton className="h-8 w-10" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
