export type PropertySeoEntry = {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
  description: string;
  /** Lower sitemap priority; optional noindex for sold inventory */
  soldOut?: boolean;
};

/** SEO fields for property detail pages — kept in sync with `/for-sale/[id]`. */
export const PROPERTY_SEO: PropertySeoEntry[] = [
  {
    id: 13,
    title: "Msabaha Phase 8",
    location: "Msabaha, Malindi",
    price: "From KES 395,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1774342011/Msabaha_phase_8_fc1tuh.jpg",
    description:
      "Msabaha Phase 8 land for sale in Malindi — 1/8 and 1/4 acre plots with title deed, flexible 12-month payment plans, and highway access near Kizingo.",
  },
  {
    id: 12,
    title: "Rafiki @10 – Prime Plots Now Selling",
    location: "Tezo, Kilifi County",
    price: "KES 650,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1771129318/Rafriki_10_Prime_plots_for_sale_s89vom.jpg",
    description:
      "Rafiki @10 plots for sale in Tezo, Kilifi — gated community, murram roads, water on site, 500m from Tezo Town off the Kilifi–Malindi Highway.",
  },
  {
    id: 11,
    title: "Mwanda Phase 3",
    location: "Mariakani, Kilifi County",
    price: "KES 325,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330607/Mwanda_Phase_3_3_ejntad.jpg",
    description:
      "Mwanda Phase 3 in Mariakani — sold-out reference listing. Browse similar land for sale in Mariakani and Kilifi County with Inuka Afrika Properties.",
    soldOut: true,
  },
  {
    id: 10,
    title: "Kibao Kiche Haven",
    location: "Mariakani, Kilifi County",
    price: "KES 399,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330214/Kibao_kiche_haven_3_syxxkx.jpg",
    description:
      "Kibao Kiche Haven plots for sale in Mariakani — 50×100 plots from KES 399,000 with zero-interest 12-month payment plan near Mariakani bypasses.",
  },
  {
    id: 9,
    title: "Ocean View Gardens",
    location: "Tezo, Kilifi County",
    price: "KES 495,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286495/Ocean_View_Gardens_2_eyxuaz.jpg",
    description:
      "Ocean View Gardens land for sale in Tezo — serviced 1/8 acre plots, 1km from the beach, utilities on site, all-inclusive pricing from KES 495,000.",
  },
  {
    id: 8,
    title: "Bofa Phase 21",
    location: "Bofa, Kilifi County",
    price: "KES 1,850,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767291293/Bofa_Phase_21_17_ss7xhv.jpg",
    description:
      "Bofa Phase 21 plots for sale on tarmacked Bofa Road (B69) — demarcated plots with water, electricity, perimeter fence, and flexible payment terms.",
  },
  {
    id: 7,
    title: "Msabaha Phase 6",
    location: "Malindi, Kizingo Area",
    price: "KES 450,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767287397/Msabaha_Phase_6_2_vebo06.jpg",
    description:
      "Msabaha Phase 6 land for sale in Malindi Kizingo — 1/8 acre plots near Mombasa–Malindi highway with water and electricity on site.",
  },
  {
    id: 6,
    title: "Malindi Airport Gardens",
    location: "Ganda Furunzi, Malindi",
    price: "KES 950,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767287215/Malindi_Airport_Gardens_dphmr6.jpg",
    description:
      "Malindi Airport Gardens plots for sale — 1/8 acre near Malindi Airport and the coast, ideal for holiday homes and coastal investment.",
  },
  {
    id: 5,
    title: "Mtondia Highway Gardens",
    location: "Mtondia, Kilifi County",
    price: "KES 1,250,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286867/Mtondia_Higway_Gardens_2_rwwsyi.jpg",
    description:
      "Mtondia Highway Gardens land touching Kilifi–Malindi Highway — serviced plots for residential, commercial, and student housing near Pwani University.",
  },
  {
    id: 4,
    title: "Chumani Phase 3",
    location: "Chumani, Kilifi County",
    price: "KES 550,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286100/chumani_phase_3_2_muym3y.jpg",
    description:
      "Chumani Phase 3 plots for sale — 1/8 acre from KES 550,000, 300m from Kilifi–Malindi Highway, ready for immediate settlement with utilities.",
  },
  {
    id: 3,
    title: "Kikambala Phase 2",
    location: "Kikambala, Kilifi County",
    price: "KES 1,250,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767285860/Kikambala_Phase_2_cw64y8.jpg",
    description:
      "Kikambala Gardens Phase 2 land for sale — gated coastal plots with perimeter fence, utilities, and 2.5km from the highway near Mtwapa.",
  },
  {
    id: 2,
    title: "Chumani Phase 6",
    location: "Chumani, Kilifi County",
    price: "KES 595,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767285403/chumani_phase_6_y4smsw.jpg",
    description:
      "Chumani Phase 6 coastal plots for sale — 400m from Kilifi–Malindi Highway, 1/8 and 1/4 acre options in a fast-growing Kilifi community.",
  },
  {
    id: 1,
    title: "Bofa Platinum",
    location: "Bofa, Kilifi County",
    price: "KES 5,990,000",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767284997/bofa_platinum_gf7vxw.jpg",
    description:
      "Bofa Platinum beachfront gated community — controlled development 30m from the beach on Bofa Road, Kilifi County premium coastal property.",
  },
];

const byId = new Map(PROPERTY_SEO.map((p) => [p.id, p]));

export function getPropertySeo(id: number): PropertySeoEntry | undefined {
  return byId.get(id);
}

export function propertyDetailPath(id: number): string {
  return `/for-sale/${id}`;
}
