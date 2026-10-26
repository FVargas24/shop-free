import { Head, useForm, usePage, router } from '@inertiajs/react';
import { 
    Plus, Package, Trash2, Edit, X, Palette, Sparkles, UploadCloud, 
    Check, Ruler, CheckSquare, Square, Image as ImageIcon, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { useState, useRef } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

interface ColorVariant {
    [key: string]: any;
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
    { nombre: 'Azul', hex: '#2563eb' },
    { nombre: 'Celeste', hex: '#0ea5e9' },
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
    const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
    
    // Checks para que la persona decida con total claridad si quiere agregar variantes o no
    const [habilitarTallas, setHabilitarTallas] = useState(false);
    const [habilitarColores, setHabilitarColores] = useState(false);

    // Vista previa de imagen antes de subir
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Custom input for new talla & color
    const [customTalla, setCustomTalla] = useState('');
    const [customColorName, setCustomColorName] = useState('');
    const [customColorHex, setCustomColorHex] = useState('#0284c7');

    const { data, setData, post, processing, reset, errors } = useForm<ProductFormData>({
        nombre: '',
        precio: '',
        stock: '',
        imagen: null,
        tallas: [],
        colores: [],
    });

    const isLimitReached = productos.length >= 6;

    const openCreateModal = () => {
        if (isLimitReached) {
            toast.error('Límite de 6 productos alcanzado', {
                description: 'Has completado los 6 productos permitidos en tu catálogo.',
            });
            return;
        }
        setEditingProducto(null);
        reset();
        setPreviewImage(null);
        setHabilitarTallas(false);
        setHabilitarColores(false);
        setCustomTalla('');
        setCustomColorName('');
        setOpen(true);
    };

    const openEditModal = (prod: Producto) => {
        setEditingProducto(prod);
        setData({
            nombre: prod.nombre,
            precio: String(prod.precio),
            stock: prod.stock !== null ? String(prod.stock) : '',
            imagen: null,
            tallas: prod.tallas || [],
            colores: prod.colores || [],
        });
        setPreviewImage(prod.imagen || null);
        setHabilitarTallas(!!prod.tallas && prod.tallas.length > 0);
        setHabilitarColores(!!prod.colores && prod.colores.length > 0);
        setCustomTalla('');
        setCustomColorName('');
        setOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) {
            setData('imagen', null);
            setPreviewImage(editingProducto?.imagen || null);
            return;
        }

        // Validar formato de imagen permitido
        const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        const isAllowedExtension = allowedExtensions.includes(file.type) || /\.(jpe?g|png|gif|webp)$/i.test(file.name);

        if (!isAllowedExtension) {
            toast.error('Formato no permitido', {
                description: 'Solo se permiten imágenes en formato JPG, PNG, WEBP o GIF.',
                duration: 5000,
            });
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Validar tamaño máximo (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Imagen demasiado pesada', {
                description: 'El tamaño máximo permitido para la foto es de 2 MB.',
                duration: 5000,
            });
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setData('imagen', file);
        const url = URL.createObjectURL(file);
        setPreviewImage(url);
    };

    const toggleTalla = (talla: string) => {
        if (data.tallas.includes(talla)) {
            setData('tallas', data.tallas.filter(t => t !== talla));
        } else {
            setData('tallas', [...data.tallas, talla]);
        }
    };

    const addCustomTalla = () => {
        const trimmed = customTalla.trim();
        if (trimmed && !data.tallas.includes(trimmed)) {
            setData('tallas', [...data.tallas, trimmed]);
            setCustomTalla('');
        }
    };

    const removeTalla = (talla: string) => {
        setData('tallas', data.tallas.filter(t => t !== talla));
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
        const trimmed = customColorName.trim();
        if (trimmed) {
            const exists = data.colores.some(c => c.nombre.toLowerCase() === trimmed.toLowerCase());
            if (!exists) {
                setData('colores', [...data.colores, { nombre: trimmed, hex: customColorHex }]);
                setCustomColorName('');
            }
        }
    };

    const removeColor = (colorName: string) => {
        setData('colores', data.colores.filter(c => c.nombre.toLowerCase() !== colorName.toLowerCase()));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = {
            ...data,
            tallas: habilitarTallas ? data.tallas : [],
            colores: habilitarColores ? data.colores : [],
        };

        if (editingProducto) {
            // Edición de producto
            router.post(route('productos.update.post', { empresa: slug, producto: editingProducto.id }), submitData, {
                onSuccess: () => {
                    setOpen(false);
                    setEditingProducto(null);
                    reset();
                    setPreviewImage(null);
                    toast.success('Producto actualizado', {
                        description: 'Los cambios se han guardado correctamente.',
                    });
                },
                onError: (errs) => {
                    const firstKey = Object.keys(errs)[0];
                    toast.error('Error al actualizar producto', {
                        description: errs[firstKey] || 'Verifica los campos obligatorios del formulario.',
                        duration: 5000,
                    });
                }
            });
        } else {
            // Creación de producto nuevo
            router.post(route('productos.store', { empresa: slug }), submitData, {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                    setPreviewImage(null);
                    toast.success('Producto creado con éxito', {
                        description: 'Tu nuevo producto ya está publicado en el catálogo.',
                    });
                },
                onError: (errs) => {
                    const firstKey = Object.keys(errs)[0];
                    toast.error('Error al guardar producto', {
                        description: errs[firstKey] || 'Por favor verifica la información ingresada.',
                        duration: 5000,
                    });
                }
            });
        }
    };

    // Modal confirmación eliminar
    const [productToDelete, setProductToDelete] = useState<Producto | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openConfirmDelete = (producto: Producto) => {
        setProductToDelete(producto);
    };

    const confirmDeleteAction = () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        router.delete(route('productos.destroy', { empresa: slug, producto: productToDelete.id }), {
            onFinish: () => {
                setIsDeleting(false);
                setProductToDelete(null);
            }
        });
    };

    const emptyCards = Array.from({ length: Math.max(0, 6 - productos.length) });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Productos" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-8">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                        <span>Mis Productos</span>
                        <span className={`text-xs font-bold py-0.5 px-2.5 rounded-full border ${
                            isLimitReached
                                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                                : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                        }`}>
                            {productos.length} / 6 productos
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                        Administra tu catálogo de forma simple. Máximo 6 productos por tienda.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button 
                        onClick={openCreateModal} 
                        disabled={isLimitReached}
                        className={`gap-2 shadow-sm rounded-xl h-10 px-4 font-bold text-white transition-all ${
                            isLimitReached
                                ? 'bg-muted-foreground/50 cursor-not-allowed opacity-60'
                                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                        }`}
                        title={isLimitReached ? 'Has alcanzado el límite máximo de 6 productos' : 'Crear nuevo producto'}
                    >
                        <Plus className="h-4 w-4" />
                        {isLimitReached ? 'Límite alcanzado (6/6)' : 'Nuevo Producto'}
                    </Button>
                </div>

                {/* MODAL CREAR / EDITAR PRODUCTO */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-[560px] max-h-[92vh] overflow-y-auto rounded-2xl p-6 border-sky-100 dark:border-sky-950 shadow-2xl">
                        <form onSubmit={submit} className="space-y-5">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                                    <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                        {editingProducto ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                    </span>
                                    {editingProducto ? `Editar: ${editingProducto.nombre}` : 'Agregar Nuevo Producto'}
                                </DialogTitle>
                                <DialogDescription className="text-xs">
                                    {editingProducto ? 'Modifica los datos del producto y presiona Guardar Cambios.' : 'Completa los datos del producto. Los campos con (*) son obligatorios.'}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                {/* 1. NOMBRE EN GRANDE */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="nombre" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                                        Nombre del Producto *
                                    </Label>
                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        placeholder="Ej: Polera Oversize, Hamburguesa Doble, Zapatillas..."
                                        className="h-11 text-sm font-semibold rounded-xl border-sky-200/80 focus-visible:border-sky-500 focus-visible:ring-sky-500/20"
                                        required
                                    />
                                    {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
                                </div>

                                {/* 2. PRECIO Y STOCK */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="precio" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                                            Precio (Bs.) *
                                        </Label>
                                        <Input
                                            id="precio"
                                            type="number"
                                            step="0.01"
                                            value={data.precio}
                                            onChange={(e) => setData('precio', e.target.value)}
                                            placeholder="0.00"
                                            className="h-10 text-sm font-mono font-bold rounded-xl border-sky-200/80"
                                            required
                                        />
                                        {errors.precio && <p className="text-xs text-destructive">{errors.precio}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="stock" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                                            Stock (Opcional)
                                        </Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            placeholder="Ilimitado o ej: 20"
                                            className="h-10 text-xs font-mono rounded-xl border-sky-200/80"
                                        />
                                        {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
                                    </div>
                                </div>

                                {/* 3. SUBIR FOTO - ZONA DROPZONE CELESTE/MARINO */}
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                        <span>Foto del Producto</span>
                                        {previewImage && (
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    setData('imagen', null);
                                                    setPreviewImage(null);
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                                className="text-[11px] text-destructive hover:underline font-medium"
                                            >
                                                Quitar foto
                                            </button>
                                        )}
                                    </Label>

                                    <input
                                        ref={fileInputRef}
                                        id="imagen-input"
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                                            previewImage 
                                                ? 'border-sky-400 bg-sky-50/40 dark:bg-sky-950/20' 
                                                : 'border-sky-200 dark:border-sky-900/60 hover:border-sky-400 hover:bg-sky-50/20 bg-muted/10'
                                        }`}
                                    >
                                        {previewImage ? (
                                            <div className="flex items-center gap-4 w-full">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-background border border-sky-200 shadow-xs shrink-0">
                                                    <img src={previewImage} alt="Vista previa" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="text-left flex-1 min-w-0">
                                                    <span className="font-bold text-xs text-foreground block truncate">
                                                        {data.imagen?.name || 'Imagen del producto'}
                                                    </span>
                                                    <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold block mt-0.5">
                                                        Haz clic para cambiar la foto
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-center space-y-1.5">
                                                <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-300 group-hover:scale-110 transition-transform">
                                                    <UploadCloud className="h-5 w-5" />
                                                </div>
                                                <span className="font-bold text-xs text-foreground">
                                                    Haz clic aquí o arrastra una imagen
                                                </span>
                                                <span className="text-[11px] text-muted-foreground">
                                                    PNG, JPG o WEBP (máximo 2MB)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {errors.imagen && <p className="text-xs text-destructive">{errors.imagen}</p>}
                                </div>

                                {/* 4. OPCIONAL: CHECKBOX DE TALLAS */}
                                <div className="rounded-2xl border border-sky-100 dark:border-sky-950 bg-sky-50/20 dark:bg-sky-950/10 p-4 space-y-3">
                                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={habilitarTallas}
                                            onChange={(e) => setHabilitarTallas(e.target.checked)}
                                            className="h-4 w-4 rounded text-blue-600 focus:ring-sky-500 border-sky-300 cursor-pointer"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                <Ruler className="h-3.5 w-3.5 text-sky-600" />
                                                ¿Este producto tiene diferentes tallas?
                                            </span>
                                            <span className="text-[11px] text-muted-foreground">
                                                Activa esto si vendes ropa, calzado o medidas (S, M, L, 38, etc.)
                                            </span>
                                        </div>
                                    </label>

                                    {habilitarTallas && (
                                        <div className="pt-2 border-t border-sky-100 dark:border-sky-900/50 space-y-3 animate-in fade-in duration-200">
                                            {/* Tallas seleccionadas actualmente */}
                                            {data.tallas.length > 0 && (
                                                <div className="space-y-1.5">
                                                    <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider block">
                                                        Tallas elegidas ({data.tallas.length}):
                                                    </span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {data.tallas.map(t => (
                                                            <span 
                                                                key={t}
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-2xs"
                                                            >
                                                                {t}
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => removeTalla(t)}
                                                                    className="hover:opacity-70"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Presets rápidos */}
                                            <div className="space-y-1">
                                                <span className="text-[11px] text-muted-foreground block">
                                                    Toca para agregar rápido:
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {PRESET_TALLAS.map(talla => {
                                                        const isSelected = data.tallas.includes(talla);
                                                        return (
                                                            <button
                                                                type="button"
                                                                key={talla}
                                                                onClick={() => toggleTalla(talla)}
                                                                className={`px-2.5 py-1 text-xs rounded-lg font-bold font-mono transition-all ${
                                                                    isSelected
                                                                        ? 'bg-blue-600 text-white ring-2 ring-sky-400'
                                                                        : 'bg-background border border-sky-200 dark:border-sky-900 text-muted-foreground hover:text-foreground hover:border-sky-400'
                                                                }`}
                                                            >
                                                                {talla}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Agregar talla manual */}
                                            <div className="flex gap-2 pt-1">
                                                <Input
                                                    value={customTalla}
                                                    onChange={(e) => setCustomTalla(e.target.value)}
                                                    placeholder="Escribir otra talla (ej: 44, XL especial)..."
                                                    className="h-8 text-xs rounded-lg border-sky-200"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addCustomTalla();
                                                        }
                                                    }}
                                                />
                                                <Button 
                                                    type="button" 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    onClick={addCustomTalla} 
                                                    className="h-8 text-xs px-3 font-bold bg-sky-100 hover:bg-sky-200 text-sky-800 dark:bg-sky-900 dark:text-sky-200 shrink-0 rounded-lg"
                                                >
                                                    + Añadir
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 5. OPCIONAL: CHECKBOX DE COLORES */}
                                <div className="rounded-2xl border border-sky-100 dark:border-sky-950 bg-sky-50/20 dark:bg-sky-950/10 p-4 space-y-3">
                                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={habilitarColores}
                                            onChange={(e) => setHabilitarColores(e.target.checked)}
                                            className="h-4 w-4 rounded text-blue-600 focus:ring-sky-500 border-sky-300 cursor-pointer"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                <Palette className="h-3.5 w-3.5 text-sky-600" />
                                                ¿Este producto tiene opciones de color?
                                            </span>
                                            <span className="text-[11px] text-muted-foreground">
                                                Activa esto si el cliente puede elegir entre varios colores
                                            </span>
                                        </div>
                                    </label>

                                    {habilitarColores && (
                                        <div className="pt-2 border-t border-sky-100 dark:border-sky-900/50 space-y-3 animate-in fade-in duration-200">
                                            {/* Colores seleccionados actualmente */}
                                            {data.colores.length > 0 && (
                                                <div className="space-y-1.5">
                                                    <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider block">
                                                        Colores elegidos ({data.colores.length}):
                                                    </span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {data.colores.map(c => (
                                                            <span 
                                                                key={c.nombre}
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-background border border-sky-200 dark:border-sky-800 shadow-2xs"
                                                            >
                                                                <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                                                                {c.nombre}
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => removeColor(c.nombre)}
                                                                    className="hover:text-destructive ml-0.5"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Presets rápidos de colores */}
                                            <div className="space-y-1">
                                                <span className="text-[11px] text-muted-foreground block">
                                                    Toca para agregar rápido:
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {PRESET_COLORES.map(color => {
                                                        const isSelected = data.colores.some(c => c.nombre.toLowerCase() === color.nombre.toLowerCase());
                                                        return (
                                                            <button
                                                                type="button"
                                                                key={color.nombre}
                                                                onClick={() => toggleColor(color)}
                                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                                                                    isSelected
                                                                        ? 'bg-blue-600 text-white shadow-xs ring-2 ring-sky-300'
                                                                        : 'bg-background border border-sky-200 dark:border-sky-900 text-muted-foreground hover:text-foreground hover:border-sky-400'
                                                                }`}
                                                            >
                                                                <span 
                                                                    className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs" 
                                                                    style={{ backgroundColor: color.hex }}
                                                                />
                                                                {color.nombre}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Agregar color manual */}
                                            <div className="flex items-center gap-2 pt-1">
                                                <input
                                                    type="color"
                                                    value={customColorHex}
                                                    onChange={(e) => setCustomColorHex(e.target.value)}
                                                    className="w-9 h-9 rounded-lg border border-sky-200 cursor-pointer bg-transparent shrink-0"
                                                    title="Elegir tono exacto"
                                                />
                                                <Input
                                                    value={customColorName}
                                                    onChange={(e) => setCustomColorName(e.target.value)}
                                                    placeholder="Nombre del color (ej: Celeste Pastel)..."
                                                    className="h-8 text-xs flex-1 rounded-lg border-sky-200"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addCustomColor();
                                                        }
                                                    }}
                                                />
                                                <Button 
                                                    type="button" 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    onClick={addCustomColor} 
                                                    className="h-8 text-xs px-3 font-bold bg-sky-100 hover:bg-sky-200 text-sky-800 dark:bg-sky-900 dark:text-sky-200 shrink-0 rounded-lg"
                                                >
                                                    + Añadir
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="pt-2 flex items-center justify-end gap-2">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setOpen(false)} 
                                    disabled={processing}
                                    className="rounded-xl text-xs h-9"
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="gap-2 rounded-xl text-xs h-9 font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    {processing ? 'Guardando...' : (editingProducto ? 'Guardar Cambios' : 'Crear Producto')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* LISTADO DE PRODUCTOS */}
            <div className="px-4 md:px-8 pb-12">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {productos.map((producto) => (
                        <Card 
                            key={producto.id} 
                            className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-sky-300 dark:hover:border-sky-700 border-border/80 group flex flex-col justify-between bg-card"
                        >
                            <div>
                                <div className="aspect-square bg-muted/40 flex items-center justify-center relative overflow-hidden">
                                    {producto.imagen ? (
                                        <img 
                                            src={producto.imagen} 
                                            alt={producto.nombre} 
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-muted-foreground/30 gap-1.5">
                                            <Package className="h-10 w-10 text-sky-600/40" />
                                            <span className="text-[11px] font-medium">Sin foto</span>
                                        </div>
                                    )}
                                    
                                    {producto.stock !== null && (
                                        <Badge variant="secondary" className="absolute top-2.5 right-2.5 backdrop-blur-md bg-background/90 text-[11px] font-extrabold shadow-xs text-sky-950 dark:text-sky-200 border border-sky-100 dark:border-sky-900">
                                            Stock: {producto.stock}
                                        </Badge>
                                    )}
                                </div>

                                <CardHeader className="p-4 pb-2">
                                    {/* NOMBRE DEL PRODUCTO EN GRANDE */}
                                    <CardTitle className="text-lg font-black text-foreground tracking-tight line-clamp-1 leading-snug">
                                        {producto.nombre}
                                    </CardTitle>
                                    <div className="text-xl font-black text-blue-600 dark:text-sky-400 mt-1 font-mono">
                                        Bs. {Number(producto.precio).toFixed(2)}
                                    </div>
                                </CardHeader>

                                <CardContent className="px-4 pb-3 pt-0 space-y-2">
                                    {/* Tallas Chips */}
                                    {producto.tallas && Array.isArray(producto.tallas) && producto.tallas.length > 0 && (
                                        <div className="flex items-center gap-1 flex-wrap">
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase mr-1">Tallas:</span>
                                            {producto.tallas.map((t, idx) => (
                                                <span key={idx} className="text-[10px] bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 px-1.5 py-0.5 rounded font-mono font-bold">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Colores Dots */}
                                    {producto.colores && Array.isArray(producto.colores) && producto.colores.length > 0 && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase mr-1">Colores:</span>
                                            {producto.colores.map((c, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs" 
                                                    style={{ backgroundColor: c.hex }}
                                                    title={c.nombre}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </div>

                            <CardFooter className="p-4 pt-2 flex gap-2 border-t border-border/60 mt-2 bg-muted/10">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 text-xs gap-1.5 h-8 rounded-xl font-bold border-sky-200 dark:border-sky-900 hover:bg-sky-50 dark:hover:bg-sky-950 hover:text-sky-700 text-foreground transition-all"
                                    onClick={() => openEditModal(producto)}
                                >
                                    <Edit className="h-3.5 w-3.5 text-sky-600" /> Editar
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2.5 rounded-xl cursor-pointer"
                                    onClick={() => openConfirmDelete(producto)}
                                    title="Eliminar producto"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {emptyCards.map((_, i) => (
                        <Card 
                            key={`empty-${i}`} 
                            onClick={openCreateModal}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    openCreateModal();
                                }
                            }}
                            className="group border-2 border-dashed border-sky-300/80 dark:border-sky-800/60 hover:border-sky-500 dark:hover:border-sky-400 flex flex-col items-center justify-center p-8 bg-sky-50/20 dark:bg-sky-950/20 hover:bg-sky-50/50 dark:hover:bg-sky-950/40 rounded-2xl cursor-pointer transition-all duration-300 min-h-[360px] text-center shadow-2xs hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-sky-100 dark:bg-sky-900/40 text-blue-600 dark:text-sky-300 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                                <Plus className="h-7 w-7 transition-colors" />
                            </div>
                            <span className="font-black text-sm text-foreground tracking-tight group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                                Agregar Producto
                            </span>
                            <span className="text-[11px] text-muted-foreground mt-1 max-w-[170px] leading-relaxed">
                                Espacio disponible ({productos.length + i + 1} de 6)
                            </span>
                            <div className="mt-4 px-3 py-1.5 rounded-xl bg-background/80 dark:bg-card border border-sky-200 dark:border-sky-850 text-[11px] font-bold text-sky-700 dark:text-sky-300 shadow-2xs flex items-center gap-1.5 group-hover:border-sky-400">
                                <Sparkles className="h-3 w-3" />
                                <span>Toca para crear</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* MODAL DIALOG CONFIRMAR ELIMINACIÓN */}
            <Dialog open={!!productToDelete} onOpenChange={(isOpen) => !isOpen && setProductToDelete(null)}>
                <DialogContent className="sm:max-w-[420px] rounded-2xl p-6 border border-border shadow-2xl">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-14 w-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-900">
                            <Trash2 className="h-7 w-7" />
                        </div>
                        <div className="space-y-1.5">
                            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                                ¿Eliminar este producto?
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Estás a punto de eliminar <span className="font-bold text-foreground">"{productToDelete?.nombre}"</span>. Esta acción no se puede deshacer.
                            </DialogDescription>
                        </div>

                        <div className="flex items-center gap-3 w-full pt-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="flex-1 rounded-xl h-10 font-medium"
                                onClick={() => setProductToDelete(null)}
                                disabled={isDeleting}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="button" 
                                variant="destructive" 
                                className="flex-1 rounded-xl h-10 font-bold bg-red-600 hover:bg-red-700 text-white"
                                onClick={confirmDeleteAction}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
