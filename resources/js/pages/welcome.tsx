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
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

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
    isExpired?: boolean;
}

interface CartItem extends Producto {
    cartKey: string; // id + selected talla + selected color
    selectedTalla?: string;
    selectedColor?: ColorVariant;
    cantidad: number;
}

interface CountryConfig {
    name: string;
    code: string;
    dial: string;
    flag: string;
    length: number;
    validPrefixes?: string[];
}

const COUNTRIES: CountryConfig[] = [
    { name: 'Bolivia', code: 'BO', dial: '+591', flag: '🇧🇴', length: 8, validPrefixes: ['5', '6', '7'] },
    { name: 'Perú', code: 'PE', dial: '+51', flag: '🇵🇪', length: 9, validPrefixes: ['9'] },
    { name: 'Argentina', code: 'AR', dial: '+54', flag: '🇦🇷', length: 10 },
    { name: 'Chile', code: 'CL', dial: '+56', flag: '🇨🇱', length: 9 },
    { name: 'Colombia', code: 'CO', dial: '+57', flag: '🇨🇴', length: 10, validPrefixes: ['3'] },
    { name: 'Ecuador', code: 'EC', dial: '+593', flag: '🇪🇨', length: 9, validPrefixes: ['9'] },
    { name: 'México', code: 'MX', dial: '+52', flag: '🇲🇽', length: 10 },
    { name: 'Paraguay', code: 'PY', dial: '+595', flag: '🇵🇾', length: 9 },
    { name: 'Uruguay', code: 'UY', dial: '+598', flag: '🇺🇾', length: 8 },
    { name: 'Brasil', code: 'BR', dial: '+55', flag: '🇧🇷', length: 11 },
    { name: 'Estados Unidos', code: 'US', dial: '+1', flag: '🇺🇸', length: 10 },
    { name: 'España', code: 'ES', dial: '+34', flag: '🇪🇸', length: 9 },
];

const DEPARTAMENTOS_BOLIVIA = [
    'Santa Cruz', 'La Paz', 'Cochabamba', 'Chuquisaca', 
    'Oruro', 'Potosí', 'Tarija', 'Beni', 'Pando'
];

export default function Welcome({ productos, empresa, isExpired = false }: WelcomeProps) {
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

    if (isExpired) {
        return (
            <BackgroundPattern variant={backgroundStyle} className={`${currentFont.fontClass} flex min-h-screen items-center justify-center p-6 text-foreground`}>
                <Head title={`Catálogo Pausado - ${empresa?.nombre_empresa}`} />
                <div className="max-w-md w-full bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-8 text-center shadow-2xl space-y-5">
                    <div className="h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
                        <Package className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                        <Badge variant="outline" className="text-amber-600 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 font-bold">
                            Catálogo Temporalmente Pausado
                        </Badge>
                        <h2 className="text-2xl font-black tracking-tight">{empresa?.nombre_empresa}</h2>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Este catálogo digital ha cumplido su período de prueba o se encuentra pausado por el administrador.
                        </p>
                    </div>

                    {empresa?.celular && (
                        <div className="pt-2">
                            <a
                                href={`https://wa.me/${empresa.celular.replace(/\D/g, '')}?text=Hola,%20vi%20tu%20cat%C3%A1logo%20en%20l%C3%ADnea.`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                            >
                                <Phone className="h-4 w-4" />
                                Contactar al Comercio por WhatsApp
                            </a>
                        </div>
                    )}

                    <div className="pt-4 border-t border-border/60 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                        <img src="/logo.svg" alt="MiraCode" className="h-4 w-4" />
                        <span>MiraCode Shop Platform</span>
                    </div>
                </div>
            </BackgroundPattern>
        );
    }
    
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

    // Estados para selector de país y validación de celular
    const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(COUNTRIES[0]);
    const [countrySearch, setCountrySearch] = useState('');
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [phoneRaw, setPhoneRaw] = useState('');
    const [phoneError, setPhoneError] = useState<string | null>(null);

    // Formulario de pedido
    const { data, setData, post, processing, reset, errors } = useForm({
        cliente: '',
        celular: '',
        departamento: 'Santa Cruz',
        pais: 'Bolivia',
        items: [] as { id: number; cantidad: number }[],
    });

    // Paises filtrados por búsqueda
    const filteredCountries = useMemo(() => {
        if (!countrySearch.trim()) return COUNTRIES;
        const q = countrySearch.toLowerCase();
        return COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q));
    }, [countrySearch]);

    // Validador de celular en tiempo real según país
    const handlePhoneChange = (val: string) => {
        const cleaned = val.replace(/\D/g, ''); // Solo dígitos
        const maxLen = selectedCountry.length;
        const trimmed = cleaned.slice(0, maxLen);
        setPhoneRaw(trimmed);

        // Validar reglas
        if (!trimmed) {
            setPhoneError('Ingresa tu número de celular');
            setData('celular', '');
            return;
        }

        if (selectedCountry.code === 'BO') {
            // Reglas para Bolivia: debe iniciar con 6, 7 o 5 y tener 8 dígitos
            const firstDigit = trimmed.charAt(0);
            if (!['6', '7', '5'].includes(firstDigit)) {
                setPhoneError('En Bolivia los celulares inician con 6 o 7 (o 5)');
            } else if (trimmed.length < 8) {
                setPhoneError(`Faltan ${8 - trimmed.length} dígitos (deben ser 8)`);
            } else {
                setPhoneError(null);
            }
        } else if (selectedCountry.validPrefixes && selectedCountry.validPrefixes.length > 0) {
            const firstDigit = trimmed.charAt(0);
            if (!selectedCountry.validPrefixes.includes(firstDigit)) {
                setPhoneError(`En ${selectedCountry.name} suele iniciar con ${selectedCountry.validPrefixes.join(', ')}`);
            } else if (trimmed.length < selectedCountry.length) {
                setPhoneError(`Faltan ${selectedCountry.length - trimmed.length} dígitos`);
            } else {
                setPhoneError(null);
            }
        } else {
            if (trimmed.length < selectedCountry.length) {
                setPhoneError(`Faltan ${selectedCountry.length - trimmed.length} dígitos`);
            } else {
                setPhoneError(null);
            }
        }

        setData('celular', `${selectedCountry.dial} ${trimmed}`);
    };

    // Cambiar país seleccionado
    const handleSelectCountry = (country: CountryConfig) => {
        setSelectedCountry(country);
        setData('pais', country.name);
        setIsCountryDropdownOpen(false);
        setCountrySearch('');
        // Re-evaluar teléfono actual
        if (phoneRaw) {
            const trimmed = phoneRaw.slice(0, country.length);
            setPhoneRaw(trimmed);
            setData('celular', `${country.dial} ${trimmed}`);
        }
    };

    useEffect(() => {
        const items = cart.map(item => ({ id: item.id, cantidad: item.cantidad }));
        setData('items', items);
    }, [cart]);

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar celular antes de enviar
        if (!phoneRaw || phoneRaw.length < selectedCountry.length) {
            setPhoneError(`El número debe tener ${selectedCountry.length} dígitos.`);
            return;
        }

        if (selectedCountry.code === 'BO') {
            const firstDigit = phoneRaw.charAt(0);
            if (!['6', '7', '5'].includes(firstDigit)) {
                setPhoneError('En Bolivia los celulares deben iniciar con 6 o 7 (o 5)');
                return;
            }
        }
        
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
            
            {/* BANNER PROMOCIONAL SUPERIOR: "¿QUIERES TU TIENDA GRATIS?" */}
            <div className="bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 text-white text-xs py-2 px-4 shadow-sm relative z-50">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center">
                        <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                        <span className="font-medium text-sky-100">
                            ¿Quieres tener tu propia tienda virtual y catálogo digital como este?
                        </span>
                        <span className="hidden md:inline-block font-extrabold text-amber-300">
                            ¡Totalmente Gratis!
                        </span>
                    </div>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-white text-blue-900 font-black text-[11px] shadow-sm hover:bg-amber-300 hover:text-blue-950 transition-all hover:scale-105 shrink-0"
                    >
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        <span>CREAR MI TIENDA GRATIS</span>
                        <ChevronRight className="h-3 w-3" />
                    </Link>
                </div>
            </div>

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
                        {/* Selector de Tema Claro / Oscuro */}
                        <AppearanceToggleDropdown />

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
            <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
                {/* Banner de Beneficios & Confianza */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 px-5 rounded-2xl bg-card border border-border/80 shadow-xs text-center text-xs">
                    <div className="flex items-center justify-center gap-2 text-foreground font-semibold py-1">
                        <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                            <Truck className="h-4 w-4 shrink-0" />
                        </div>
                        <span className="truncate">Envíos a todo el país</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-foreground font-semibold py-1 sm:border-x sm:border-border/80">
                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="h-4 w-4 shrink-0" />
                        </div>
                        <span className="truncate">Compra 100% Segura</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-foreground font-semibold py-1">
                        <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400">
                            <MessageCircle className="h-4 w-4 shrink-0" />
                        </div>
                        <span className="truncate">Atención directa por WhatsApp</span>
                    </div>
                </div>

                {/* Barra de Filtros y Búsqueda */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-2 rounded-2xl bg-card/60 border border-border/60">
                    {/* Input Búsqueda en vivo */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por nombre de producto..."
                            className="pl-9 h-11 rounded-xl bg-background border-border text-xs font-medium shadow-2xs focus-visible:ring-primary/30"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
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
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                                        selectedTallaFilter === 'all'
                                            ? 'bg-foreground text-background border-foreground shadow-xs'
                                            : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                                    }`}
                                >
                                    Todas
                                </button>
                                {allAvailableTallas.map((talla) => (
                                    <button
                                        key={talla}
                                        onClick={() => setSelectedTallaFilter(talla)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                                            selectedTallaFilter === talla
                                                ? 'bg-foreground text-background border-foreground shadow-xs'
                                                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                                        }`}
                                    >
                                        Talla {talla}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Botones Switch Cuadrícula vs Lista */}
                        <div className="flex items-center border rounded-xl p-1 bg-background border-border shrink-0 shadow-2xs">
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

                {/* LISTADO DE PRODUCTOS (GRID O LIST) O EMPTY STATE ELEGANTE */}
                {filteredProductos.length === 0 ? (
                    <div className="text-center py-16 px-6 bg-card border border-border/80 rounded-3xl shadow-sm relative overflow-hidden">
                        {/* Decoración sutil de fondo */}
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
                        
                        <div className="relative z-10 max-w-md mx-auto space-y-4">
                            <div className="h-16 w-16 rounded-2xl bg-muted/60 text-muted-foreground/50 border border-border flex items-center justify-center mx-auto shadow-inner">
                                <Package className="h-8 w-8 text-primary/70" />
                            </div>
                            
                            <div className="space-y-1.5">
                                <h3 className="font-black text-lg text-foreground tracking-tight">
                                    {searchQuery ? 'Sin resultados para tu búsqueda' : 'Catálogo listo para publicar productos'}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {searchQuery 
                                        ? `No encontramos productos que coincidan con "${searchQuery}". Intenta con otra palabra.`
                                        : 'Aún no se han agregado productos a esta tienda. ¡Vuelve pronto o contacta al comercio para pedidos especiales!'
                                    }
                                </p>
                            </div>

                            <div className="pt-2 flex items-center justify-center gap-2.5 flex-wrap">
                                {searchQuery ? (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setSearchQuery('')} 
                                        className="rounded-xl text-xs font-bold border-border"
                                    >
                                        Limpiar búsqueda
                                    </Button>
                                ) : (
                                    empresa?.celular && (
                                        <a
                                            href={`https://wa.me/${empresa.celular.replace(/\D/g, '')}?text=Hola,%20me%20gustar%C3%ADa%20consultar%20por%20sus%20productos.`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                                        >
                                            <Phone className="h-3.5 w-3.5" />
                                            Consultar por WhatsApp
                                        </a>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={
                        userLayout === 'list'
                            ? 'grid grid-cols-1 md:grid-cols-2 gap-3.5'
                            : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5'
                    }>
                        {filteredProductos.map((producto) => (
                            <Card 
                                key={producto.id} 
                                className={`group overflow-hidden rounded-2xl border border-border/90 bg-card shadow-xs transition-all duration-300 hover:shadow-xl hover:border-primary/50 ${
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
                            <div className="grid gap-1.5">
                                <Label htmlFor="cliente" className="text-xs font-semibold flex items-center justify-between">
                                    <span>Tu Nombre Completo *</span>
                                    <span className="text-[10px] text-muted-foreground font-normal">Se guardará en MAYÚSCULAS</span>
                                </Label>
                                <Input
                                    id="cliente"
                                    value={data.cliente}
                                    onChange={(e) => setData('cliente', e.target.value.toUpperCase())}
                                    placeholder="EJ: RONALD MIRANDA FLORES"
                                    required
                                    className="h-10 text-xs rounded-xl uppercase font-semibold tracking-wide"
                                />
                                {errors.cliente && <p className="text-[11px] text-destructive">{errors.cliente}</p>}
                            </div>

                            {/* CELULAR CON SELECTOR DE PAÍS + BUSCADOR */}
                            <div className="grid gap-1.5">
                                <Label htmlFor="celular" className="text-xs font-semibold flex items-center justify-between">
                                    <span>Número de Celular / WhatsApp *</span>
                                    <span className="text-[10px] font-mono font-medium text-primary">
                                        {phoneRaw.length}/{selectedCountry.length} dígitos
                                    </span>
                                </Label>
                                
                                <div className="relative">
                                    <div className="flex gap-2">
                                        {/* Selector de país */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                                className="h-10 px-3 rounded-xl border border-input bg-card/80 hover:bg-muted/80 flex items-center gap-1.5 text-xs font-semibold shadow-2xs transition-colors shrink-0"
                                            >
                                                <span className="text-base leading-none">{selectedCountry.flag}</span>
                                                <span className="font-mono text-muted-foreground">{selectedCountry.dial}</span>
                                                <ChevronRight className={`h-3 w-3 text-muted-foreground transition-transform ${isCountryDropdownOpen ? 'rotate-90' : ''}`} />
                                            </button>

                                            {/* Dropdown de países con buscador */}
                                            {isCountryDropdownOpen && (
                                                <div className="absolute left-0 bottom-full mb-1 z-50 w-72 max-h-64 rounded-xl border border-border bg-popover/95 backdrop-blur-md shadow-xl flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
                                                    <div className="p-2 border-b bg-muted/30">
                                                        <div className="relative">
                                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                                            <input
                                                                type="text"
                                                                value={countrySearch}
                                                                onChange={(e) => setCountrySearch(e.target.value)}
                                                                placeholder="Buscar país o código..."
                                                                className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                                                                autoFocus
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="overflow-y-auto max-h-52 divide-y divide-border/40">
                                                        {filteredCountries.map((c) => (
                                                            <button
                                                                key={c.code}
                                                                type="button"
                                                                onClick={() => handleSelectCountry(c)}
                                                                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-accent hover:text-accent-foreground transition-colors ${
                                                                    selectedCountry.code === c.code ? 'bg-primary/10 text-primary font-bold' : ''
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-base leading-none">{c.flag}</span>
                                                                    <span>{c.name}</span>
                                                                </div>
                                                                <span className="font-mono text-[11px] text-muted-foreground font-semibold">{c.dial}</span>
                                                            </button>
                                                        ))}
                                                        {filteredCountries.length === 0 && (
                                                            <div className="p-4 text-center text-xs text-muted-foreground">
                                                                No se encontró el país
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Input de número */}
                                        <div className="relative flex-1">
                                            <Input
                                                id="celular"
                                                type="tel"
                                                inputMode="numeric"
                                                value={phoneRaw}
                                                onChange={(e) => handlePhoneChange(e.target.value)}
                                                placeholder={selectedCountry.code === 'BO' ? 'Ej: 71234567 o 60012345' : 'Número de celular'}
                                                maxLength={selectedCountry.length}
                                                required
                                                className={`h-10 text-xs rounded-xl font-mono tracking-wider font-semibold ${
                                                    phoneError ? 'border-destructive focus-visible:ring-destructive' : ''
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Indicador de Validación */}
                                    {phoneError ? (
                                        <p className="text-[11px] text-destructive mt-1 flex items-center gap-1 font-medium">
                                            <span className="h-1.5 w-1.5 rounded-full bg-destructive inline-block" />
                                            {phoneError}
                                        </p>
                                    ) : phoneRaw.length === selectedCountry.length ? (
                                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Número válido ({selectedCountry.name})
                                        </p>
                                    ) : null}
                                </div>
                                {errors.celular && <p className="text-[11px] text-destructive">{errors.celular}</p>}
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="departamento" className="text-xs font-semibold">Ciudad / Departamento *</Label>
                                <select
                                    id="departamento"
                                    value={data.departamento}
                                    onChange={(e) => setData('departamento', e.target.value)}
                                    className="h-10 px-3 text-xs rounded-xl border border-input bg-background font-medium focus:ring-1 focus:ring-primary"
                                    required
                                >
                                    {DEPARTAMENTOS_BOLIVIA.map(dep => (
                                        <option key={dep} value={dep}>{dep}</option>
                                    ))}
                                    <option value="Otro">Otro / Fuera de Bolivia</option>
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
                                disabled={processing || !data.cliente.trim() || !phoneRaw || phoneRaw.length < selectedCountry.length || !!phoneError} 
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
