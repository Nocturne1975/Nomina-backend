import type { Request, Response } from 'express';
import prisma from '../utils/prisma';

// GET - lister tous les noms de personnage
export const getNomPersonnages = async (_req: Request, res: Response) => {
  try {
    const noms = await prisma.nomPersonnage.findMany({
      include: {
        culture: true,
        categorie: true,
      },
      orderBy: { id: 'asc' },
    });
    res.json(noms);
  } catch (error) {
    console.error('Erreur getNomPersonnages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET - récupérer un nom de personnage par id (avec relations)
export const getNomPersonnageById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const nom = await prisma.nomPersonnage.findUnique({
      where: { id },
      include: {
        culture: true,
        categorie: true,
      },
    });
    if (!nom) return res.status(404).json({ error: 'NomPersonnage non trouvé' });
    res.json(nom);
  } catch (error) {
    console.error('Erreur getNomPersonnageById:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST - créer un nouveau NomPersonnage
export const createNomPersonnage = async (req: Request, res: Response) => {
  try {
    const {
      valeur,
      genre,
      cultureId,
      categorieId,
    } = req.body as {
      valeur?: string;
      genre?: string;
      cultureId?: number | string | null;
      categorieId?: number | string | null;
    };

    // conversion si les ids sont envoyés en string
    const cultureIdNum = cultureId !== undefined && cultureId !== null ? Number(cultureId) : null;
    const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;

    const newNomPersonnage = await prisma.nomPersonnage.create({
      data: {
        valeur: valeur ?? null,
        genre: genre ?? null,
        // on peut fournir directement les FK
        cultureId: cultureIdNum,
        categorieId: categorieIdNum,
      },
    });

    res.status(201).json(newNomPersonnage);
  } catch (error) {
    console.error('Erreur createNomPersonnage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// PUT - modifier un NomPersonnage par son id
export const updateNomPersonnage = async (req: Request, res: Response) => {
  try {
    const {
      valeur,
      genre,
      cultureId,
      categorieId,
    } = req.body as {
      valeur?: string | null;
      genre?: string | null;
      cultureId?: number | string | null;
      categorieId?: number | string | null;
    };

    const cultureIdNum = cultureId !== undefined && cultureId !== null ? Number(cultureId) : null;
    const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;

    const updated = await prisma.nomPersonnage.update({
      where: { id: Number(req.params.id) },
      data: {
        valeur: valeur ?? null,
        genre: genre ?? null,
        cultureId: cultureIdNum,
        categorieId: categorieIdNum,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Erreur updateNomPersonnage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// DELETE - supprimer un NomPersonnage
export const deleteNomPersonnage = async (req: Request, res: Response) => {
  try {
    await prisma.nomPersonnage.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    console.error('Erreur deleteNomPersonnage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Aggregation - obtenir le nombre total de NomPersonnage
export const totalNomPersonnage = async (_req: Request, res: Response) => {
  try {
    const count = await prisma.nomPersonnage.count();
    res.json({ total: count });
  } catch (error) {
    console.error('Erreur totalNomPersonnage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

