import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    const { lang } = useLanguage();
    const isAr = lang === "ar";
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        dir={isAr ? "rtl" : "ltr"}
        className={({ isActive, isPending }) =>
          cn(
            "text-start",
            className,
            isActive && activeClassName,
            isPending && pendingClassName,
          )
        }
        {...props}
      />
    );
  },
);
NavLink.displayName = "NavLink";
export { NavLink };
