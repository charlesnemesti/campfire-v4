import type { ReactNode } from "react";

type SectionWrapProps = {
  children: ReactNode;
  id?: string;
  className?: string;
};

export function SectionWrap({
  children,
  id,
  className = "",
}: SectionWrapProps) {
  return (
    <section id={id} className={`section-flow ${className}`}>
      <div className="section-flow-inner mx-auto max-w-6xl px-4 sm:px-6">
        {children}
      </div>
    </section>
  );
}
