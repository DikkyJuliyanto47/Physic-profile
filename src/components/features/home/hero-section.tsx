/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 07:49:09 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 08:07:14
 */

import { Button, Container, Section } from "@/components/ui/index";
import { LatestNewsPanel } from "./latest-news-panel";

// Hero dan panel "Berita" digabung dalam satu Section
export function HeroSection() {
    return (
        <Section tone="muted">
            <Container className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
                <div className="flex flex-col gap-5">
                    <span className="text-sm font-semibold text-primary-600">
                        Physical Society of Indonesia
                    </span>
                    <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                        Menghubungkan Komunitas Fisika di Surabaya &amp; Jawa Timur
                    </h1>
                    <p className="max-w-xl text-foreground-muted">
                        Wadah kolaborasi akademisi, peneliti, dan pendidik fisika dari
                        perguruan tinggi di wilayah Surabaya untuk pengembangan keilmuan,
                        pendidikan, dan penelitian fisika.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button href="/kontak">Gabung sebagai anggota</Button>
                        <Button href="/tentang" variant="outline">Tentang Kami</Button>
                    </div>
                </div>
                <LatestNewsPanel />
            </Container>
        </Section>
    );
}