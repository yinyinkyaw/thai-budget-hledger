import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-radial-[at_52%_-52%] **:[text-shadow:0_1px_0_var(--color-primary)] inset-shadow-2xs inset-shadow-white/25 dark:inset-shadow/30 border text-sm ring-0 transition-[filter] duration-200 hover:brightness-125 active:brightness-95 dark:border-0 h-9 px-4 py-2 has-[>svg]:px-3",
  {
    variants: {
      variant: {
        default:
          "border-primary from-primary/70 to-primary/95 text-primary-foreground dark:from-primary dark:to-primary/70 dark:hover:to-primary",
        destructive:
          "border-destructive from-destructive/70 to-destructive/95 dark:from-destructive dark:to-destructive/70 dark:hover:to-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-radial-[at_52%_52%] hover:from-accent/70 hover:to-accent/95 hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inset-shadow-neutral/25",
        secondary:
          "border bg-secondary text-secondary-foreground inset-shadow-border",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "bg-transparent inset-shadow-white dark:inset-shadow-trasparent border-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
