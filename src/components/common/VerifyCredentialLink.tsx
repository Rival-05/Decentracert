import Link from "next/link";
import { buildVerifyHref } from "@/config/navigation";

type VerifyCredentialLinkProps = {
  cid: string;
  children?: React.ReactNode;
  className?: string;
};

export function VerifyCredentialLink({
  cid,
  children = "Verify this credential",
  className = "text-foreground text-sm font-medium underline underline-offset-4",
}: VerifyCredentialLinkProps) {
  return (
    <Link href={buildVerifyHref(cid)} className={className}>
      {children}
    </Link>
  );
}
