import type { ReactNode } from "react";
import { buildRuntimePdfUrl } from "@/utils/buildRuntimePdfUrl";

type RuntimePdfLinkProps = {
  /** e.g. "Elements_spa menu_arb.pdf" or "/Runtime/uploads/Elements_spa%20menu_arb.pdf" */
  path: string;
  children: ReactNode;
  className?: string;
};

const RuntimePdfLink = ({ path, children, className }: RuntimePdfLinkProps) => (
  <a href={buildRuntimePdfUrl(path)} className={className}>
    {children}
  </a>
);

export default RuntimePdfLink;
