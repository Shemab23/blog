import { HOME_PAGE_DATA } from "@/data/HomeData";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  const { navbar, footer } = HOME_PAGE_DATA;

  return (
    <footer className="border-t border-border bg-sidebar/40 mt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">
        {/* Top Row: Brand Identity & Quick Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src={navbar.logo}
                alt={`${navbar.brandName} logo`}
                width={24}
                height={24}
                className="rounded object-contain"
              />
              <span className="font-semibold tracking-tight text-sm text-foreground">
                {navbar.brandName}
              </span>
            </Link>
            <p className="text-xs font-mono text-muted-foreground">
              {footer.tagline}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-5 text-xs font-mono text-muted-foreground">
            {footer.navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Row: Copyright, Location & External Profiles */}
        <div className="pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>
              © {footer.copyrightYear} {navbar.brandName}
            </span>
            <span className="opacity-40">•</span>
            <span>{footer.location}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {footer.socialLinks.map((social) => {
              const isExternal = social.href.startsWith("http");
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="hover:text-foreground transition-colors"
                >
                  {social.label}
                  {isExternal && <span className="ml-0.5 opacity-60">↗</span>}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
