import prisma from "../../utils/prisma";
import { createRng } from "./rng";
import { fakerFR as faker } from "@faker-js/faker";

type GenerateNpcOptions = {
  count: number;
  cultureId?: number;
  categorieId?: number;
  genre?: string;
  seed?: string;
};

export async function generateNpcIdeas(options: GenerateNpcOptions) {
  const rng = createRng(options.seed);
  const seed = options.seed ?? rng.seed;

  const genreIn = options.genre ? normalizeGenreValues(options.genre) : undefined;

  const names = await prisma.nomPersonnage.findMany({
    where: {
      valeur: { not: null },
      cultureId: options.cultureId,
      categorieId: options.categorieId,
      genre: genreIn && genreIn.length > 0 ? { in: genreIn } : options.genre,
    },
    select: { id: true, valeur: true, genre: true, cultureId: true, categorieId: true },
  });

  if (names.length === 0) {
    return {
      seed,
      count: 0,
      filters: { cultureId: options.cultureId ?? null, categorieId: options.categorieId ?? null, genre: options.genre ?? null },
      items: [],
      warning: "Aucun NomPersonnage ne match les filtres.",
    };
  }
  const uniqueNames = dedupeBy(names, (n) => normalizeName(n.valeur ?? ""));
    
  const fragmentWhere: any = { OR: [{ appliesTo: null }, { appliesTo: "npc" }] };

  if (options.cultureId !== undefined) {
    fragmentWhere.AND = [...(fragmentWhere.AND ?? []), { OR: [{ cultureId: options.cultureId }, { cultureId: null }] }];
  }
  if (options.categorieId !== undefined) {
    fragmentWhere.AND = [...(fragmentWhere.AND ?? []), { OR: [{ categorieId: options.categorieId }, { categorieId: null }] }];
  }
  if (options.genre !== undefined) {
    const genreValues = normalizeGenreValues(options.genre);
    if (genreValues.length > 0) {
      fragmentWhere.AND = [
        ...(fragmentWhere.AND ?? []),
        { OR: [{ genre: { in: genreValues } }, { genre: null }] },
      ];
    } else {
      fragmentWhere.AND = [...(fragmentWhere.AND ?? []), { OR: [{ genre: options.genre }, { genre: null }] }];
    }
  }

  const fragments = await prisma.fragmentsHistoire.findMany({
    where: fragmentWhere,
    select: { id: true, texte: true, minNameLength: true, maxNameLength: true },
  });

  const items = [];
  const usedNameIds = new Set<number>();

  for (let i = 0; i < options.count; i++) {
    const name = pickUnique(uniqueNames, usedNameIds, rng.next);
    const nameText = name.valeur ?? "Inconnu";
    const nameLen = nameText.length;

    const eligibleFragments = fragments.filter(f => {
      if (f.minNameLength !== null && f.minNameLength !== undefined && nameLen < f.minNameLength) return false;
      if (f.maxNameLength !== null && f.maxNameLength !== undefined && nameLen > f.maxNameLength) return false;
      return true;
    });

    const fragmentCount = eligibleFragments.length >= 3 ? (rng.next() < 0.5 ? 2 : 3) : Math.min(2, eligibleFragments.length);
    const picked = sampleWithoutReplacement(eligibleFragments, fragmentCount, rng.next);

    const baseBackstory = picked
      .map(p => p.texte)
      .join(" ")
      .replaceAll("{name}", nameText)
      .trim();

    // Enrichissement: quelques détails "inspirations" générés (déterministes via seed)
    faker.seed(Math.floor(rng.next() * 2_147_483_647));
    const role = faker.person.jobTitle();
    const trait1 = faker.word.adjective();
    const trait2 = faker.word.adjective();
    const hook = faker.lorem.sentence();
    const extra = faker.lorem.sentences(2);

    const backstory = [baseBackstory, `Rôle: ${role}.`, `Traits: ${trait1}, ${trait2}.`, hook, extra]
      .filter((s) => typeof s === "string" && s.trim().length > 0)
      .join(" ")
      .replaceAll("{name}", nameText)
      .trim();

    items.push({
      nameId: name.id,
      name: nameText,
      genre: name.genre ?? null,
      cultureId: name.cultureId ?? null,
      categorieId: name.categorieId ?? null,
      fragmentIds: picked.map(p => p.id),
      backstory,
      role,
      traits: [trait1, trait2],
      hook,
    });
  }

  return {
    seed,
    count: items.length,
    filters: {
      cultureId: options.cultureId ?? null,
      categorieId: options.categorieId ?? null,
      genre: options.genre ?? null,
    },
    items,
  };
}

function normalizeGenreValues(input: string): string[] {
  const raw = input.trim();
  if (!raw) return [];
  const lc = raw.toLowerCase();

  const out = new Set<string>();
  const add = (s: string) => {
    if (s && s.trim()) out.add(s);
  };

  if (["m", "masculin", "male", "homme"].includes(lc)) {
    ["M", "m", "Masculin", "masculin", "Male", "male", "Homme", "homme"].forEach(add);
  } else if (["f", "féminin", "feminin", "female", "femme"].includes(lc)) {
    ["F", "f", "Féminin", "féminin", "Feminin", "feminin", "Female", "female", "Femme", "femme"].forEach(add);
  } else if (["nb", "non-binaire", "non binaire", "nonbinaire", "neutre", "neutral", "neutre."].includes(lc)) {
    [
      "NB",
      "nb",
      "Non-binaire",
      "non-binaire",
      "Non binaire",
      "non binaire",
      "Nonbinaire",
      "nonbinaire",
      "Neutre",
      "neutre",
      "Neutral",
      "neutral",
    ].forEach(add);
  } else {
    add(raw);
  }

  return Array.from(out);
}

function normalizeName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}

function dedupeBy<T>(arr: T[], key: (x: T) => string) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    const k = key(item);
    if (!k) continue;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

function pickUnique<T extends { id: number }>(arr: T[], used: Set<number>, rnd: () => number): T {
  if (used.size >= arr.length) return arr[Math.floor(rnd() * arr.length)];
  let candidate = arr[Math.floor(rnd() * arr.length)];
  while (used.has(candidate.id)) candidate = arr[Math.floor(rnd() * arr.length)];
  used.add(candidate.id);
  return candidate;
}

function sampleWithoutReplacement<T>(arr: T[], k: number, rnd: () => number): T[] {
  const copy = arr.slice();
  const out: T[] = [];
  for (let i = 0; i < k && copy.length > 0; i++) {
    const idx = Math.floor(rnd() * copy.length);
    out.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return out;
}