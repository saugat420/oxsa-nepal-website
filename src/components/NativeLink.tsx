import type { AnchorHTMLAttributes } from "react";

type NativeLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

/**
 * Uses full-document navigation so links remain reliable behind the
 * production access gateway, where client-side RSC navigation is unavailable.
 */
export function NativeLink({ href, children, ...props }: NativeLinkProps) {
  return <a href={href} {...props}>{children}</a>;
}
