import type { MouseEvent, ReactNode } from "react";
import {
  buildRuntimePdfUrl,
  isMobilePdfClient,
  openRuntimePdf,
} from "@/utils/buildRuntimePdfUrl";

type RuntimePdfLinkProps = {
  /** e.g. "Elements_spa menu_arb.pdf" or "/Runtime/uploads/Elements_spa%20menu_arb.pdf" */
  path: string;
  children: ReactNode;
  className?: string;
};

const RuntimePdfLink = ({ path, children, className }: RuntimePdfLinkProps) => {
  const mobile = isMobilePdfClient();
  const href = buildRuntimePdfUrl(path);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!mobile) return;
    event.preventDefault();
    void openRuntimePdf(path);
  };

  return (
    <a
      href={href}
      target={mobile ? undefined : "_blank"}
      rel={mobile ? undefined : "noopener noreferrer"}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
};

export default RuntimePdfLink;
