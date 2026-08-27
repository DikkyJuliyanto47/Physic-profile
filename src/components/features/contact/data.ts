export interface ContactChannel {
    id: string;
    icon: string;
    label: string;
    value: string;
    actionLabel: string;
    href?: string;
}

export const contactChannels: ContactChannel[] = [
  {
    id: "email",
    icon: "fa-regular fa-envelope",
    label: "Email",
    value: "info@psisurabaya.or.id",
    actionLabel: "Kirim Email",
    href: "mailto:info@psisurabaya.or.id",
  },
  {
    id: "phone",
    icon: "fa-solid fa-phone",
    label: "Telepon",
    value: "+62 8XX-XXXX-XXXX",
    actionLabel: "Hubungi Kami",
  },
  {
    id: "location",
    icon: "fa-solid fa-location-dot",
    label: "Lokasi",
    value: "Surabaya, Jawa Timur",
    actionLabel: "Lihat di Peta",
  },
];

export interface Secretariat {
    name: string;
    addressLines: string[];
    mapsHref?: string;
}

export const secretariat: Secretariat = {
  name: "PSI Cabang Surabaya",
  addressLines: [
    "Alamat lengkap sekretariat belum tersedia dan akan diperbarui oleh pengurus.",
  ],
  mapsHref: "https://www.google.com/maps?sca_esv=9768f4bab40ae0e6&rlz=1C1GCEA_enID1155ID1155&sxsrf=APpeQnuG9bStWC-NyIs374qjpHCnSIAqSg:1787804032069&biw=1478&bih=835&gs_lp=Egxnd3Mtd2l6LXNlcnAiIXVuaXZlcnNpdGFzIG5lZ2VyaSBzdXJhYmF5YSBrZXRpbioCCAAyBRAuGIAEMgUQABiABDIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgIQJjICECYyAhAmMhQQLhiABBiXBRjcBBjeBBjgBNgBAUihLlCIA1ikC3ABeAGQAQCYAf0BoAH7B6oBBTAuNC4yuAEDyAEA-AEBmAIKoAKAQcICChAAGEcY1gQYsAPCAg0QABiABBiKBRhDGLADwgIOEAAY5AIY1gQYsAPYAQHCAhcQLhjcBhi4BhjaBhjYAhjIAxiwA9gBAcICFxAuGNgCGLgGGNoGGNwGGMgDGLAD2AEBwgIOEC4YgAQYxwEYrwEYjgXCAgoQABiABBiKBRhDwgILEC4YrwEYxwEYgASYAwCIBgGQBhK6BgYIARABGAmSBw0xLjQuMi43LTIuMC4xoAeAXLIHBTAuNC4yuAfmCMIHBzItMy40LjPIB5gBgAgB&um=1&ie=UTF-8&fb=1&gl=id&sa=X&geocode=KYNPvoFw-9ctMT1L5qO-DsCp&daddr=Jl.+Ketintang+Wiyata,+Ketintang,+Kec.+Gayungan,+Surabaya,+Jawa+Timur+60231"
};