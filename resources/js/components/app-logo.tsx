import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 p-1 shadow-xs">
                <img src="/logo.svg" alt="MiraCode Logo" className="size-full object-contain" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold tracking-tight text-foreground">MiraCode</span>
                <span className="text-[10px] text-muted-foreground leading-none">Shop Platform</span>
            </div>
        </div>
    );
}
