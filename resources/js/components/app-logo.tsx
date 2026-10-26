import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-white/10 border border-white/15 p-2 shadow-inner">
                <img src="/logo.svg" alt="MiraCode Logo" className="size-full object-contain drop-shadow" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-black tracking-tight text-white text-base">MiraCode</span>
                <span className="text-[11px] text-sky-400 font-bold tracking-wide">Shop Platform</span>
            </div>
        </div>
    );
}
