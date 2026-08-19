import Image from "next/image";
import Link from "next/link";

import { Container, Section, SectionHeading } from "@/components/ui";
import { universities } from "./data";

export function UniversitiesSection() {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-8">
        <div className="text-center">
          <SectionHeading
            eyebrow="PERGURUAN TINGGI"
            title="Perguruan Tinggi Anggota"
            align="center"
          />

          <div className="mx-auto mt-3 h-0.5 w-16 bg-primary-600" />
        </div>

        <div className="mt-8 w-full">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {universities.map((university) => {
              const content = (
                <div className="group flex h-full flex-col items-center rounded-xl bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:bg-neutral-50">
                  <div className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
                    <Image
                      src={university.logo}
                      alt={university.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <p className="mt-3 text-center text-xs font-medium leading-relaxed text-neutral-700 sm:text-sm">
                    {university.name}
                  </p>
                </div>
              );

              return university.href ? (
                <Link
                  key={university.id}
                  href={university.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {content}
                </Link>
              ) : (
                <div key={university.id} className="h-full">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}