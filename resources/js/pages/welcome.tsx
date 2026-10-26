import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    Package, ShoppingCart, Trash2, CheckCircle2, ChevronRight, Phone, 
    MapPin, Search, ArrowRight, Sparkles, Filter, X, Plus, Minus, MessageCircle, ExternalLink,
    LayoutGrid, List, ShieldCheck, Truck, RefreshCw
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type SharedData } from '@/types';
import { BackgroundPattern } from '@/components/catalog/background-pattern';
import { COLOR_THEMES, FONT_THEMES } from '@/lib/theme-config';

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
    empresa?: {
        nombre_empresa: string;
    };
}

interface Empresa {
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

interface WelcomeProps {
    productos: Producto[];
    empresa: Empresa;
}

interface CartItem extends Producto {
    cartKey: string; // id + selected talla + selected color
    selectedTalla?: string;
    selectedColor?: ColorVariant;
    cantidad: number;
}

const DEPARTAMENTOS_BOLIVIA = [
    'Santa Cruz', 'La Paz', 'Cochabamba', 'Chuquisaca', 
    'Oruro', 'Potosí', 'Tarija', 'Beni', 'Pando'
];

export default function Welcome({ productos, empresa }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    
    // Configuración visual dinámica elegida por el dueño
    const currentTheme = COLOR_THEMES[empresa?.tema_color || 'emerald'] || COLOR_THEMES.emerald;
    const currentFont = FONT_THEMES[empresa?.tipografia || 'inter'] || FONT_THEMES.inter;
    const backgroundStyle = empresa?.fondo_estilo || 'dots';
    
    // Vista por defecto: cuadrícula moderna de 2 a 4 columnas
    const [userLayout, setUserLayout] = useState<'grid' | 'list'>((empresa?.layout_vista as any) || 'grid');

    // Estados de navegación y catálogo
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    // Búsqueda y Filtros en tiempo real
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTallaFilter, setSelectedTallaFilter] = useState<string>('all');
    
    // Modal de Producto (Quickview con selección de variante)
    const [quickViewProduct, setQuickViewProduct] = useState<Producto | null>(null);
    const [selectedTalla, setSelectedTalla] = useState<string | undefined>(undefined);
    const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(undefined);
    const [quickQuantity, setQuickQuantity] = useState(1);

    // Header scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Persist cart en localstorage por tienda
    const cartStorageKey = `shopfree_cart_${empresa?.slug || 'global'}`;
    useEffect(() => {
        const saved = localStorage.getItem(cartStorageKey);
        if (saved) {
            try { setCart(JSON.parse(saved)); } catch (e) { setCart([]); }
        }
    }, [cartStorageKey]);

    useEffect(() => {
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    }, [cart, cartStorageKey]);

    // Apertura de Quickview
    const openQuickView = (producto: Producto) => {
        setQuickViewProduct(producto);
        setSelectedTalla(producto.tallas && producto.tallas.length > 0 ? producto.tallas[0] : undefined);
        setSelectedColor(producto.colores && producto.colores.length > 0 ? producto.colores[0] : undefined);
        setQuickQuantity(1);
    };

    // Agregar al carrito
    const addToCartWithSelection = (producto: Producto, talla?: string, color?: ColorVariant, qty = 1) => {
        const cartKey = `${producto.id}_${talla || 'notalla'}_${color?.nombre || 'nocolor'}`;
        
        setCart(prev => {
            const existing = prev.find(item => item.cartKey === cartKey);
            if (existing) {
                return prev.map(item => item.cartKey === cartKey ? { ...item, cantidad: item.cantidad + qty } : item);
            }
            return [...prev, {
                ...producto,
                cartKey,
                selectedTalla: talla,
                selectedColor: color,
                cantidad: qty,
            }];
        });
        setQuickViewProduct(null);
        setIsCartOpen(true);
    };

    // Click rápido en "+": si tiene variantes, abre modal para elegir; si no, agrega directo
    const handleQuickAdd = (producto: Producto) => {
        const hasVariants = (producto.tallas && producto.tallas.length > 0) || (producto.colores && producto.colores.length > 0);
        if (hasVariants) {
            openQuickView(producto);
        } else {
            addToCartWithSelection(producto, undefined, undefined, 1);
        }
    };

    const removeFromCart = (cartKey: string) => {
        setCart(prev => prev.filter(item => item.cartKey !== cartKey));
    };

    const updateQuantity = (cartKey: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.cartKey === cartKey) {
                const newQty = Math.max(1, item.cantidad + delta);
                return { ...item, cantidad: newQty };
            }
            return item;
        }));
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

    // Formulario de pedido
    const { data, setData, post, processing, reset, errors } = useForm({
        cliente: '',
        celular: '',
        departamento: 'Santa Cruz',
        pais: 'Bolivia',
        items: [] as { id: number; cantidad: number }[],
    });

    useEffect(() => {
        const items = cart.map(item => ({ id: item.id, cantidad: item.cantidad }));
        setData('items', items);
    }, [cart]);

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('pedidos.store', { empresa: empresa.slug }), {
            onSuccess: () => {
                // Generar mensaje opcional de WhatsApp
                if (empresa?.celular) {
                    const cleanPhone = empresa.celular.replace(/\D/g, '');
                    const itemsText = cart.map(item => {
                        const variantDetails = [item.selectedTalla ? `Talla: ${item.selectedTalla}` : null, item.selectedColor ? `Color: ${item.selectedColor.nombre}` : null].filter(Boolean).join(', ');
                        return `• ${item.cantidad}x ${item.nombre} ${variantDetails ? `(${variantDetails})` : ''} - Bs. ${(item.precio * item.cantidad).toFixed(2)}`;
                    }).join('%0A');

                    const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hola%20*${encodeURIComponent(empresa.nombre_empresa)}*!%20Acabo%20de%20realizar%20un%20pedido%20en%20su%20cat%C3%A1logo:%0A%0A*Cliente:*%20${encodeURIComponent(data.cliente)}%0A*Tel%C3%A9fono:*%20${encodeURIComponent(data.celular)}%0A*Ciudad:*%20${encodeURIComponent(data.departamento)}%0A%0A*Productos:*%0A${itemsText}%0A%0A*Total:*%20Bs.%20${cartTotal.toFixed(2)}`;
                    
                    window.open(whatsappUrl, '_blank');
                }

                setCart([]);
                setIsCheckoutOpen(false);
                setIsSuccessOpen(true);
                reset();
            },
        });
    };

    // Filtrar productos
    const filteredProductos = useMemo(() => {
        return productos.filter(p => {
            const matchesQuery = p.nombre.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTalla = selectedTallaFilter === 'all' || (p.tallas && p.tallas.includes(selectedTallaFilter));
            return matchesQuery && matchesTalla;
        });
    }, [productos, searchQuery, selectedTallaFilter]);

    // Recoger todas las tallas disponibles en los productos para la barra de filtros
    const allAvailableTallas = useMemo(() => {
        const set = new Set<string>();
        productos.forEach(p => {
            if (p.tallas && Array.isArray(p.tallas)) {
                p.tallas.forEach(t => set.add(t));
            }
        });
        return Array.from(set);
    }, [productos]);

    return (
        <BackgroundPattern variant={backgroundStyle} className={`${currentFont.fontClass} text-foreground antialiased selection:bg-primary/20`}>
            <Head title={`Catálogo - ${empresa?.nombre_empresa}`} />
            
            {/* BARRA SUPERIOR / NAVBAR */}
            <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
                scrolled 
                ? 'bg-background/85 backdrop-blur-md border-b shadow-xs py-3' 
                : 'bg-transparent py-4'
            }`}>
                <div className="max-w-6xl px-4 md:px-6 mx-auto flex items-center justify-between">
                    {/* Logo & Nombre */}
                    <div className="flex items-center gap-3">
                        <div 
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform hover:scale-105"
                            style={{ backgroundColor: currentTheme.bgHex }}
                        >
                            <Package className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-lg sm:text-xl tracking-tight leading-none text-foreground">
                                {empresa?.nombre_empresa || 'Catálogo Digital'}
                            </h1>
                            {empresa?.descripcion && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-xs sm:max-w-md">
                                    {empresa.descripcion}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Acciones del Header */}
                    <div className="flex items-center gap-2">
                        {empresa?.celular && (
                            <a 
                                href={`https://wa.me/${empresa.celular.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                            >
                                <MessageCircle className="h-3.5 w-3.5" />
                                WhatsApp
                            </a>
                        )}

                        {/* Botón Carrito */}
                        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                            <SheetTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="relative h-10 px-3.5 gap-2 rounded-full shadow-xs hover:border-primary/50 transition-all"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    <span className="hidden sm:inline text-xs font-semibold">Carrito</span>
                                    {cartCount > 0 && (
                                        <span 
                                            className="h-5 min-w-5 px-1 rounded-full text-[11px] font-bold text-white flex items-center justify-center shadow-xs"
                                            style={{ backgroundColor: currentTheme.bgHex }}
                                        >
                                            {cartCount}
                                        </span>
                                    )}
                                </Button>
                            </SheetTrigger>

                            {/* CONTENIDO DEL CARRITO */}
                            <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
                                <SheetHeader className="p-5 border-b">
                                    <SheetTitle className="flex items-center justify-between text-base font-bold">
                                        <div className="flex items-center gap-2">
                                            <ShoppingCart className="h-5 w-5 text-primary" />
                                            Tu Carrito de Compras
                                        </div>
                                        <Badge variant="secondary" className="text-xs">{cartCount} items</Badge>
                                    </SheetTitle>
                                </SheetHeader>

                                {/* Lista de productos en carrito */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                                    {cart.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center py-12 text-muted-foreground">
                                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
                                                <ShoppingCart className="h-8 w-8 opacity-40" />
                                            </div>
                                            <h4 className="font-semibold text-foreground text-sm">El carrito está vacío</h4>
                                            <p className="text-xs mt-1 max-w-[200px]">Explora el catálogo y agrega los productos que te gusten.</p>
                                        </div>
                                    ) : (
                                        cart.map((item) => (
                                            <div key={item.cartKey} className="flex gap-3 p-3 rounded-xl border bg-card/60 backdrop-blur-xs">
                                                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                    {item.imagen ? (
                                                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="h-6 w-6 opacity-30" />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-semibold text-xs text-foreground truncate">{item.nombre}</h5>
                                                    
                                                    {/* Variantes seleccionadas */}
                                                    {(item.selectedTalla || item.selectedColor) && (
                                                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                                                            {item.selectedTalla && (
                                                                <span className="bg-muted px-1.5 py-0.2 rounded font-mono font-medium">
                                                                    Talla: {item.selectedTalla}
                                                                </span>
                                                            )}
                                                            {item.selectedColor && (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <span className="w-2 h-2 rounded-full border border-black/10" style={{ backgroundColor: item.selectedColor.hex }} />
                                                                    {item.selectedColor.nombre}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="text-xs font-bold text-primary mt-1">
                                                        Bs. {(item.precio * item.cantidad).toFixed(2)}
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center border rounded-lg overflow-hidden bg-background">
                                                            <button 
                                                                onClick={() => updateQuantity(item.cartKey, -1)} 
                                                                className="px-2 py-0.5 hover:bg-muted text-xs transition-colors"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="px-2 text-xs font-semibold">{item.cantidad}</span>
                                                            <button 
                                                                onClick={() => updateQuantity(item.cartKey, 1)} 
                                                                className="px-2 py-0.5 hover:bg-muted text-xs transition-colors"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        <button 
                                                            onClick={() => removeFromCart(item.cartKey)}
                                                            className="text-xs text-muted-foreground hover:text-destructive transition-colors p-1"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {cart.length > 0 && (
                                    <SheetFooter className="p-5 border-t bg-card/60 backdrop-blur-md space-y-3">
                                        <div className="w-full flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">Total a Pagar</span>
                                            <span className="text-xl font-black text-foreground">Bs. {cartTotal.toFixed(2)}</span>
                                        </div>

                                        <Button 
                                            className="w-full font-bold h-11 text-sm shadow-md gap-2"
                                            style={{ backgroundColor: currentTheme.bgHex }}
                                            onClick={() => {
                                                setIsCartOpen(false);
                                                setIsCheckoutOpen(true);
                                            }}
                                        >
                                            Continuar con el Pedido
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </SheetFooter>
                                )}
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* SECCIÓN PRINCIPAL: FILTROS & BÚSQUEDA */}
            <main className="max-w-6xl mx-auto px-4 md:px-6 py-4 space-y-6">
                {/* Banner de Confianza y Facilidad de Uso */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-4 rounded-2xl bg-card/60 backdrop-blur-md border border-border/60 text-center text-xs">
                    <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                        <Truck className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate font-medium">Envíos a todo el país</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-muted-foreground border-x border-border/60">
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate font-medium">Compra 100% Segura</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                        <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="truncate font-medium">Atención por WhatsApp</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    {/* Input Búsqueda en vivo */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por nombre de producto..."
                            className="pl-9 h-10 rounded-xl bg-card/90 backdrop-blur-xs border-border/80 text-xs shadow-2xs"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 justify-between sm:justify-end">
                        {/* Chips de filtro por tallas */}
                        {allAvailableTallas.length > 0 && (
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                                <button
                                    onClick={() => setSelectedTallaFilter('all')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                                        selectedTallaFilter === 'all'
                                            ? 'bg-foreground text-background shadow-xs'
                                            : 'bg-card/70 border border-border text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    Todas
                                </button>
                                {allAvailableTallas.map((talla) => (
                                    <button
                                        key={talla}
                                        onClick={() => setSelectedTallaFilter(talla)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                                            selectedTallaFilter === talla
                                                ? 'bg-foreground text-background shadow-xs'
                                                : 'bg-card/70 border border-border text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Talla {talla}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Botones Switch Cuadrícula vs Lista */}
                        <div className="flex items-center border rounded-xl p-0.5 bg-card/80 border-border/80 shrink-0">
                            <button
                                type="button"
                                onClick={() => setUserLayout('grid')}
                                className={`p-1.5 rounded-lg transition-all ${userLayout === 'grid' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Vista en Cuadrícula"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserLayout('list')}
                                className={`p-1.5 rounded-lg transition-all ${userLayout === 'list' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Vista en Lista"
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* LISTADO DE PRODUCTOS (GRID O LIST) */}
                {filteredProductos.length === 0 ? (
                    <div className="text-center py-16 bg-card/40 rounded-2xl border border-dashed border-border p-8">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                        <h3 className="font-bold text-base text-foreground">No encontramos productos</h3>
                        <p className="text-xs text-muted-foreground mt-1">Prueba cambiando tu búsqueda o seleccionando otra talla.</p>
                        {searchQuery && (
                            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')} className="mt-4 text-xs">
                                Limpiar búsqueda
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className={
                        userLayout === 'list'
                            ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
                            : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5'
                    }>
                        {filteredProductos.map((producto) => (
                            <Card 
                                key={producto.id} 
                                className={`group overflow-hidden rounded-2xl border border-border/70 bg-card/85 backdrop-blur-xs transition-all duration-300 hover:shadow-xl hover:border-primary/40 ${
                                    userLayout === 'list' ? 'flex flex-row items-center p-3 gap-4' : 'flex flex-col'
                                }`}
                            >
                                {/* Imagen con Aspect Ratio optimizado */}
                                <div 
                                    className={`relative bg-muted overflow-hidden cursor-pointer ${
                                        userLayout === 'list' 
                                            ? 'w-24 h-24 sm:w-28 sm:h-28 rounded-xl shrink-0' 
                                            : 'aspect-square w-full'
                                    }`}
                                    onClick={() => openQuickView(producto)}
                                >
                                    {producto.imagen ? (
                                        <img 
                                            src={producto.imagen} 
                                            alt={producto.nombre} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground/30">
                                            <Package className="h-8 w-8" />
                                        </div>
                                    )}

                                    {/* Stock Tag */}
                                    {producto.stock !== null && (
                                        <Badge 
                                            variant="secondary" 
                                            className="absolute top-2 left-2 text-[10px] font-bold backdrop-blur-md bg-background/85 shadow-2xs py-0.5 px-1.5"
                                        >
                                            {producto.stock > 0 ? `${producto.stock} disp.` : 'Agotado'}
                                        </Badge>
                                    )}
                                </div>

                                {/* Información del Producto */}
                                <div className={`flex flex-col justify-between flex-1 ${userLayout === 'list' ? 'min-w-0' : 'p-3.5 space-y-2'}`}>
                                    <div>
                                        <h3 
                                            onClick={() => openQuickView(producto)}
                                            className="font-bold text-xs sm:text-sm text-foreground line-clamp-2 hover:text-primary transition-colors cursor-pointer leading-tight"
                                        >
                                            {producto.nombre}
                                        </h3>

                                        {/* Tallas / Colores Preview */}
                                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                            {producto.tallas && producto.tallas.length > 0 && (
                                                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                                                    {producto.tallas.length} tallas
                                                </span>
                                            )}
                                            {producto.colores && producto.colores.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    {producto.colores.slice(0, 3).map((c, i) => (
                                                        <span 
                                                            key={i} 
                                                            className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs" 
                                                            style={{ backgroundColor: c.hex }} 
                                                        />
                                                    ))}
                                                    {producto.colores.length > 3 && (
                                                        <span className="text-[9px] text-muted-foreground font-mono">+{producto.colores.length - 3}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Precio y Botón de Acción */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="font-extrabold text-sm sm:text-base text-foreground">
                                            Bs. {Number(producto.precio).toFixed(2)}
                                        </div>

                                        <Button
                                            size="sm"
                                            className="h-8 px-2.5 rounded-xl font-semibold text-xs shadow-xs gap-1"
                                            style={{ backgroundColor: currentTheme.bgHex }}
                                            onClick={() => handleQuickAdd(producto)}
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">Pedir</span>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* FOOTER MODERNO CON BRANDING MIRACODE */}
                <footer className="mt-16 pt-8 pb-14 border-t border-border/50 text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                        <img src="/logo.svg" alt="MiraCode Logo" className="h-6 w-6 object-contain" />
                        <span className="font-extrabold text-sm tracking-tight text-foreground">MiraCode</span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <span>Esta página está creada con</span>
                        <a 
                            href="https://miracode.org" 
                            target="_blank" 
                            rel="noreferrer"
                            className="font-bold text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                        >
                            MiraCode
                        </a>
                        <span>• Plataforma de Comercio Digital</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground/60">
                        © {new Date().getFullYear()} {empresa?.nombre_empresa || 'Tienda'}. Todos los derechos reservados.
                    </p>
                </footer>
            </main>

            {/* BOTÓN FLOTANTE MÓVIL DEL CARRITO (STICKY PILL) */}
            {cartCount > 0 && !isCartOpen && !isCheckoutOpen && (
                <div className="fixed bottom-4 inset-x-4 z-30 sm:hidden">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full py-3 px-4 rounded-2xl shadow-xl flex items-center justify-between text-white font-bold text-sm backdrop-blur-md transition-transform active:scale-98 animate-in fade-in slide-in-from-bottom-4"
                        style={{ backgroundColor: currentTheme.bgHex }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                                {cartCount}
                            </span>
                            <span>Ver mi pedido</span>
                        </div>
                        <span>Bs. {cartTotal.toFixed(2)}</span>
                    </button>
                </div>
            )}

            {/* MODAL DETALLE / QUICKVIEW DE PRODUCTO CON VARIANTES */}
            <Dialog open={!!quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
                <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl">
                    {quickViewProduct && (
                        <div>
                            {/* Imagen Header */}
                            <div className="aspect-video w-full bg-muted relative overflow-hidden flex items-center justify-center">
                                {quickViewProduct.imagen ? (
                                    <img src={quickViewProduct.imagen} alt={quickViewProduct.nombre} className="w-full h-full object-cover" />
                                ) : (
                                    <Package className="h-12 w-12 text-muted-foreground/30" />
                                )}
                            </div>

                            <div className="p-5 space-y-4">
                                <div>
                                    <DialogTitle className="text-lg font-bold">{quickViewProduct.nombre}</DialogTitle>
                                    <div className="text-xl font-extrabold text-primary mt-1">
                                        Bs. {Number(quickViewProduct.precio).toFixed(2)}
                                    </div>
                                </div>

                                {/* Selección de Talla */}
                                {quickViewProduct.tallas && quickViewProduct.tallas.length > 0 && (
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Selecciona Talla:
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {quickViewProduct.tallas.map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setSelectedTalla(t)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                                                        selectedTalla === t
                                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                                            : 'bg-muted hover:bg-muted/80 text-foreground'
                                                    }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Selección de Color */}
                                {quickViewProduct.colores && quickViewProduct.colores.length > 0 && (
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Selecciona Color: {selectedColor?.nombre}
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {quickViewProduct.colores.map((c) => (
                                                <button
                                                    key={c.nombre}
                                                    type="button"
                                                    onClick={() => setSelectedColor(c)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                                        selectedColor?.nombre === c.nombre
                                                            ? 'ring-2 ring-primary bg-primary/10 text-primary font-bold'
                                                            : 'bg-muted hover:bg-muted/80 text-foreground'
                                                    }`}
                                                >
                                                    <span className="w-3 h-3 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: c.hex }} />
                                                    {c.nombre}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Cantidad */}
                                <div className="flex items-center justify-between pt-2">
                                    <Label className="text-xs font-semibold text-muted-foreground">Cantidad:</Label>
                                    <div className="flex items-center border rounded-xl overflow-hidden bg-background">
                                        <button 
                                            onClick={() => setQuickQuantity(Math.max(1, quickQuantity - 1))}
                                            className="px-3 py-1 hover:bg-muted font-bold text-sm"
                                        >
                                            -
                                        </button>
                                        <span className="px-3 text-xs font-bold">{quickQuantity}</span>
                                        <button 
                                            onClick={() => setQuickQuantity(quickQuantity + 1)}
                                            className="px-3 py-1 hover:bg-muted font-bold text-sm"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <Button 
                                    className="w-full font-bold h-11 text-sm shadow-md mt-2"
                                    style={{ backgroundColor: currentTheme.bgHex }}
                                    onClick={() => addToCartWithSelection(quickViewProduct, selectedTalla, selectedColor, quickQuantity)}
                                >
                                    Agregar al Carrito • Bs. {(quickViewProduct.precio * quickQuantity).toFixed(2)}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL DE CHECKOUT / DATOS DEL COMPRADOR */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="sm:max-w-[460px] rounded-2xl">
                    <form onSubmit={handleCheckout} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">Datos para tu Pedido</DialogTitle>
                            <DialogDescription className="text-xs">
                                Completa tus datos de entrega para enviar tu orden al comercio.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3 py-2">
                            <div className="grid gap-1">
                                <Label htmlFor="cliente" className="text-xs font-semibold">Tu Nombre Completo *</Label>
                                <Input
                                    id="cliente"
                                    value={data.cliente}
                                    onChange={(e) => setData('cliente', e.target.value)}
                                    placeholder="Ej: Ronald Miranda"
                                    required
                                    className="h-10 text-xs rounded-xl"
                                />
                                {errors.cliente && <p className="text-[11px] text-destructive">{errors.cliente}</p>}
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="celular" className="text-xs font-semibold">Tu Número de Celular / WhatsApp *</Label>
                                <Input
                                    id="celular"
                                    value={data.celular}
                                    onChange={(e) => setData('celular', e.target.value)}
                                    placeholder="Ej: 71234567"
                                    required
                                    className="h-10 text-xs rounded-xl"
                                />
                                {errors.celular && <p className="text-[11px] text-destructive">{errors.celular}</p>}
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="departamento" className="text-xs font-semibold">Ciudad / Departamento *</Label>
                                <select
                                    id="departamento"
                                    value={data.departamento}
                                    onChange={(e) => setData('departamento', e.target.value)}
                                    className="h-10 px-3 text-xs rounded-xl border border-input bg-background"
                                    required
                                >
                                    {DEPARTAMENTOS_BOLIVIA.map(dep => (
                                        <option key={dep} value={dep}>{dep}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Resumen del Monto */}
                            <div className="rounded-xl bg-muted/50 p-3.5 flex items-center justify-between mt-3">
                                <div>
                                    <span className="text-xs font-medium text-muted-foreground block">Total a Cancelar</span>
                                    <span className="text-base font-black text-foreground">Bs. {cartTotal.toFixed(2)}</span>
                                </div>
                                <span className="text-[11px] text-muted-foreground font-medium">Pago contra entrega / QR</span>
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsCheckoutOpen(false)}
                                disabled={processing}
                                className="text-xs rounded-xl"
                            >
                                Volver
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="font-bold text-xs rounded-xl shadow-md gap-2"
                                style={{ backgroundColor: currentTheme.bgHex }}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                {processing ? 'Enviando...' : 'Confirmar Pedido'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL DE ÉXITO TRAS REALIZAR EL PEDIDO */}
            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="sm:max-w-[400px] text-center p-6 rounded-2xl">
                    <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <DialogTitle className="text-lg font-bold">¡Pedido Enviado con Éxito!</DialogTitle>
                    <DialogDescription className="text-xs mt-1">
                        Hemos registrado tu orden en el sistema. El comercio se pondrá en contacto contigo a la brevedad.
                    </DialogDescription>
                    <DialogFooter className="mt-4 sm:justify-center">
                        <Button 
                            onClick={() => setIsSuccessOpen(false)}
                            className="w-full font-bold text-xs rounded-xl"
                            style={{ backgroundColor: currentTheme.bgHex }}
                        >
                            Entendido, seguir viendo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </BackgroundPattern>
    );
}
