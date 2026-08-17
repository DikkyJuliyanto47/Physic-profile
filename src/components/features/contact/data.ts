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
  name: "PSI Surabaya",
  addressLines: [
    "Alamat lengkap sekretariat belum tersedia dan akan diperbarui oleh pengurus.",
  ],
};