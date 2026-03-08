import type { Category } from "@/types/product";

export const treatmentCategories: Category[] = [
  {
    id: "hair-removal",
    slug: "harborttagning",
    name: "Hårborttagning",
    description:
      "Professionella lasersystem för permanent hårborttagning med de senaste teknologierna",
    icon: "hair",
    order: 1,
  },
  {
    id: "tattoo-removal",
    slug: "tatueringsborttagning",
    name: "Tatueringsborttagning",
    description:
      "Avancerade pico- och Q-switch lasrar för effektiv tatueringsborttagning",
    icon: "tattoo",
    order: 2,
  },
  {
    id: "skin-rejuvenation",
    slug: "hudforyngring-hudatstramning",
    name: "Hudföryngring / Hudåtstramning",
    description:
      "Behandlingar för hudföryngring, åtstramning och förbättrad hudkvalitet",
    icon: "skin",
    order: 3,
  },
  {
    id: "co2-fractional",
    slug: "co2-fraktionerad-laser",
    name: "CO₂ fraktionerad laser",
    description:
      "Fraktionerade CO₂ lasrar för hudförnyelse och ärrbehandling",
    icon: "laser",
    order: 4,
  },
  {
    id: "body-sculpting",
    slug: "kropp-muskler-fett",
    name: "Kropp, muskler & fett",
    description:
      "Kroppsskulptering, fettreducering och muskelstimulering",
    icon: "body",
    order: 5,
  },
  {
    id: "facial-treatments",
    slug: "ansiktsbehandlingar",
    name: "Ansiktsbehandlingar",
    description:
      "Avancerade ansiktsbehandlingar för förbättrad hudkvalitet",
    icon: "face",
    order: 6,
  },
  {
    id: "pigmentation",
    slug: "pigmentflackar",
    name: "Pigmentfläckar",
    description:
      "Behandling av pigmentfläckar, melasma och ojämn hudton",
    icon: "pigment",
    order: 7,
  },
  {
    id: "acne-scars",
    slug: "akne-arr-hudbristningar",
    name: "Akne, ärr och hudbristningar",
    description:
      "Effektiva behandlingar för akne, ärr och hudbristningar",
    icon: "scar",
    order: 8,
  },
  {
    id: "vascular",
    slug: "ytliga-blodkarl-angiom",
    name: "Ytliga blodkärl/angiom",
    description:
      "Behandling av ytliga blodkärl, angiom och rosacea",
    icon: "vascular",
    order: 9,
  },
  {
    id: "surgery",
    slug: "kirurgi",
    name: "Kirurgi",
    description:
      "Kirurgiska lasersystem för precision och minimal vävnadsskada",
    icon: "surgery",
    order: 10,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return treatmentCategories.find((cat) => cat.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return treatmentCategories.find((cat) => cat.id === id);
}

