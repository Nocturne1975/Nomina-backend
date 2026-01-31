import type { Request, Response } from "express";
import { z } from "zod";
import { fakerFR as faker } from "@faker-js/faker";
import { generateNpcIdeas } from "../services/generation/npcGenerator";
import prisma from "../utils/prisma";
import { createRng } from "../services/generation/rng";

const countQuerySchema = z.coerce.number().int().min(1).max(200).default(10);
const optionalIdQuerySchema = z.coerce.number().int().optional();
const optionalStringQuerySchema = z
  .string()
  .transform((s) => s.trim())
  .optional()
  .transform((s) => (s && s.length > 0 ? s : undefined));

export const generateNpcs = async (req: Request, res: Response) => {
  try {
    const parsed = z
      .object({
        count: countQuerySchema,
        cultureId: optionalIdQuerySchema,
        categorieId: optionalIdQuerySchema,
        genre: optionalStringQuerySchema,
        seed: optionalStringQuerySchema,
      })
      .safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Paramètres invalides",
        issues: parsed.error.issues,
      });
    }

    const { count, cultureId, categorieId, genre, seed } = parsed.data;

    const result = await generateNpcIdeas({ count, cultureId, categorieId, genre, seed });
    res.json(result);
  } catch (error) {
    console.error("Erreur generateNpcs:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

function normalizeGenreValues(input: string): string[] {
  const raw = input.trim();
  if (!raw) return [];
  const lc = raw.toLowerCase();

  const m = new Set<string>();
  const add = (s: string) => {
    if (s && s.trim()) m.add(s);
  };

  // Ajout des variantes courantes (la BD peut contenir "M"/"F"/"NB" OU des libellés).
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
    // Si c'est une valeur custom (ex: "androgyne"), on la garde telle quelle.
    add(raw);
  }

  return Array.from(m);
}

function buildGenreWhere(input?: string): { in: string[] } | undefined {
  if (input === undefined) return undefined;
  const values = normalizeGenreValues(input);
  return values.length > 0 ? { in: values } : undefined;
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

// GET /generate/nom-personnages
export const generateNomPersonnages = async (req: Request, res: Response) => {
  try {
    const parsed = z
      .object({
        count: countQuerySchema,
        cultureId: optionalIdQuerySchema,
        categorieId: optionalIdQuerySchema,
        genre: optionalStringQuerySchema,
        seed: optionalStringQuerySchema,
      })
      .safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Paramètres invalides",
        issues: parsed.error.issues,
      });
    }

    const { count, cultureId, categorieId, genre, seed } = parsed.data;

    const rng = createRng(seed);
    const effectiveSeed = seed ?? rng.seed;

    const rows = await prisma.nomPersonnage.findMany({
      where: {
        valeur: { not: null },
        cultureId,
        categorieId,
        genre: buildGenreWhere(genre),
      },
      select: { id: true, valeur: true, genre: true, cultureId: true, categorieId: true },
      orderBy: { id: "asc" },
    });

    const items = sampleWithoutReplacement(rows, Math.min(count, rows.length), rng.next).map((n) => ({
      id: n.id,
      valeur: n.valeur,
      genre: n.genre ?? null,
      cultureId: n.cultureId ?? null,
      categorieId: n.categorieId ?? null,
    }));

    res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: { cultureId: cultureId ?? null, categorieId: categorieId ?? null, genre: genre ?? null },
      items,
      warning: rows.length === 0 ? "Aucun NomPersonnage ne match les filtres." : undefined,
    });
  } catch (error) {
    console.error("Erreur generateNomPersonnages:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /generate/lieux
export const generateLieux = async (req: Request, res: Response) => {
  try {
    const parsed = z
      .object({
        count: countQuerySchema,
        categorieId: optionalIdQuerySchema,
        seed: optionalStringQuerySchema,
      })
      .safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Paramètres invalides",
        issues: parsed.error.issues,
      });
    }

    const { count, categorieId, seed } = parsed.data;

    const rng = createRng(seed);
    const effectiveSeed = seed ?? rng.seed;

    const rows = await prisma.lieux.findMany({
      where: {
        categorieId,
      },
      select: { id: true, value: true, type: true, categorieId: true },
      orderBy: { id: "asc" },
    });

    const items = sampleWithoutReplacement(rows, Math.min(count, rows.length), rng.next).map((l) => ({
      id: l.id,
      value: l.value,
      type: l.type ?? null,
      categorieId: l.categorieId ?? null,
    }));

    res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: { categorieId: categorieId ?? null },
      items,
      warning: rows.length === 0 ? "Aucun Lieu ne match les filtres." : undefined,
    });
  } catch (error) {
    console.error("Erreur generateLieux:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /generate/fragments-histoire
export const generateFragmentsHistoire = async (req: Request, res: Response) => {
  try {
    const parsed = z
      .object({
        count: countQuerySchema,
        cultureId: optionalIdQuerySchema,
        categorieId: optionalIdQuerySchema,
        genre: optionalStringQuerySchema,
        appliesTo: optionalStringQuerySchema,
        seed: optionalStringQuerySchema,
      })
      .safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Paramètres invalides",
        issues: parsed.error.issues,
      });
    }

    const { count, cultureId, categorieId, genre, appliesTo, seed } = parsed.data;

    const rng = createRng(seed);
    const effectiveSeed = seed ?? rng.seed;

    const rows = await prisma.fragmentsHistoire.findMany({
      where: {
        cultureId,
        categorieId,
        genre: buildGenreWhere(genre),
        appliesTo,
      },
      select: { id: true, texte: true, appliesTo: true, genre: true, cultureId: true, categorieId: true },
      orderBy: { id: "asc" },
    });

    const items = sampleWithoutReplacement(rows, Math.min(count, rows.length), rng.next).map((f) => ({
      id: f.id,
      texte: f.texte,
      appliesTo: f.appliesTo ?? null,
      genre: f.genre ?? null,
      cultureId: f.cultureId ?? null,
      categorieId: f.categorieId ?? null,
    }));

    res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: {
        cultureId: cultureId ?? null,
        categorieId: categorieId ?? null,
        genre: genre ?? null,
        appliesTo: appliesTo ?? null,
      },
      items,
      warning: rows.length === 0 ? "Aucun Fragment d'histoire ne match les filtres." : undefined,
    });
  } catch (error) {
    console.error("Erreur generateFragmentsHistoire:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /generate/titres
export const generateTitres = async (req: Request, res: Response) => {
  try {
    const parsed = z
      .object({
        count: countQuerySchema,
        cultureId: optionalIdQuerySchema,
        categorieId: optionalIdQuerySchema,
        genre: optionalStringQuerySchema,
        seed: optionalStringQuerySchema,
      })
      .safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Paramètres invalides",
        issues: parsed.error.issues,
      });
    }

    const { count, cultureId, categorieId, genre, seed } = parsed.data;

    const rng = createRng(seed);
    const effectiveSeed = seed ?? rng.seed;

    const rows = await prisma.titre.findMany({
      where: {
        cultureId,
        categorieId,
        genre: buildGenreWhere(genre),
      },
      select: { id: true, valeur: true, type: true, genre: true, cultureId: true, categorieId: true },
      orderBy: { id: "asc" },
    });

    const items = sampleWithoutReplacement(rows, Math.min(count, rows.length), rng.next).map((t) => ({
      id: t.id,
      valeur: t.valeur,
      type: t.type ?? null,
      genre: t.genre ?? null,
      cultureId: t.cultureId ?? null,
      categorieId: t.categorieId ?? null,
    }));

    res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: { cultureId: cultureId ?? null, categorieId: categorieId ?? null, genre: genre ?? null },
      items,
      warning: rows.length === 0 ? "Aucun Titre ne match les filtres." : undefined,
    });
  } catch (error) {
    console.error("Erreur generateTitres:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /generate/concepts
export const generateConcepts = async (req: Request, res: Response) => {
  try {
    const parsed = z
      .object({
        count: countQuerySchema,
        categorieId: optionalIdQuerySchema,
        seed: optionalStringQuerySchema,
      })
      .safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Paramètres invalides",
        issues: parsed.error.issues,
      });
    }

    const { count, categorieId, seed } = parsed.data;

    const rng = createRng(seed);
    const effectiveSeed = seed ?? rng.seed;

    const rows = await prisma.concept.findMany({
      where: {
        categorieId,
      },
      select: {
        id: true,
        valeur: true,
        type: true,
        mood: true,
        keywords: true,
        categorieId: true,
      },
      orderBy: { id: "asc" },
    });

    const items = sampleWithoutReplacement(rows, Math.min(count, rows.length), rng.next).map((c) => {
      faker.seed(Math.floor(rng.next() * 2_147_483_647));

      const elevatorPitch = faker.lorem.sentences(2);
      const twist = faker.lorem.sentence();
      const hook = faker.lorem.sentence();
      const questions = [faker.lorem.sentence(), faker.lorem.sentence()];

      return {
        id: c.id,
        valeur: c.valeur,
        type: c.type ?? null,
        mood: c.mood ?? null,
        keywords: c.keywords ?? null,
        categorieId: c.categorieId ?? null,

        // Champs "créatifs" (non persistés) pour enrichir la génération.
        elevatorPitch,
        twist,
        hook,
        questions,
      };
    });

    res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: { categorieId: categorieId ?? null },
      items,
      warning: rows.length === 0 ? "Aucun Concept ne match les filtres." : undefined,
    });
  } catch (error) {
    console.error("Erreur generateConcepts:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

