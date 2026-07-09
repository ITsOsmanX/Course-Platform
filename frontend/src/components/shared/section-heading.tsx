import React from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignment =
    align === "left"
      ? "text-left items-start"
      : "text-center items-center";

  return (
    <div
      className={`flex flex-col ${alignment} mb-16 max-w-3xl mx-auto`}
    >
      {eyebrow && (
        <span className="mb-3 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
          {eyebrow}
        </span>
      )}

      <h2 className="text-4xl font-bold leading-tight md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}