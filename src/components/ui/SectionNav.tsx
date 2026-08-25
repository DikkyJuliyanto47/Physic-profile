"use client";

import { useEffect, useState } from "react";

type SectionNavItem = {
  label: string;
  href: string;
};

type SectionNavProps = {
  items: SectionNavItem[];
  defaultActiveHref?: string;
  className?: string;
};

export function SectionNav({
  items,
  defaultActiveHref,
  className = "",
}: SectionNavProps) {
  const [activeHref, setActiveHref] = useState(
    defaultActiveHref ?? items[0]?.href ?? ""
  );

  useEffect(() => {
    const sections = items
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const activeSection = visibleSections[0];

        if (activeSection?.target.id) {
          setActiveHref(`#${activeSection.target.id}`);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (href: string) => {
    setActiveHref(href);

    const target = document.querySelector(href);

    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", href);
  };

  return (
    <nav aria-label="Section navigation" className={className}>
      <ul className="border-t border-neutral-200">
        {items.map((item) => {
          const isActive = item.href === activeHref;

          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  handleClick(item.href);
                }}
                className={[
                  "flex min-h-12 items-center border-b border-neutral-200 px-3 text-base font-medium transition-colors duration-200",
                  isActive
                    ? "border-l-2 border-l-primary-600 bg-primary-50 text-primary-800"
                    : "border-l-2 border-l-transparent text-neutral-700 hover:bg-neutral-50 hover:text-primary-700",
                ].join(" ")}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}