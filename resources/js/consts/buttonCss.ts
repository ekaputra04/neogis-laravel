export const buttonCss =
    "inline-flex justify-center items-center gap-2 disabled:opacity-50 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&_svg]:size-4 font-medium text-sm whitespace-nowrap transition-colors [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg]:shrink-0 px-3 py-1 ";

export const buttonDestructiveCss =
    buttonCss +
    " bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 ";

export const buttonOutlineCss =
    buttonCss +
    " border border-input bg-background shadow-sm dark:text-white hover:bg-accent hover:text-accent-foreground";
