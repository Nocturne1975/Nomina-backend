import type { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getCategorieById = async (req: Request, res: Response) => {
  try {
    const categorie = await prisma.categorie.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        nomPersonnages: true,
        lieux: true,
        fragmentsHistoire: true,
        titres: true,
        concepts: true,
      },
    });
    if (!categorie) return res.status(404).json({ error: 'Catégorie non trouvée' });
    res.json(categorie);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST - creer une nouvelle catégorie
export const createCategorie = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body as { name: string; description: string };
    const newCategorie = await prisma.categorie.create({
      data: { name, description },
    });
    res.status(201).json(newCategorie);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// PUT - modifier la categorie par son id
export const updateCategorie  = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body as { name: string; description: string };
    const updatedCategorie = await prisma.categorie.update({
      where: { id: Number(req.params.id) },
      data: { name, description },
    });
    res.json(updatedCategorie);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// DELETE - supprimer une categorie
export const deleteCategorie = async (req: Request, res: Response) => {
  try {
    await prisma.categorie.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Aggregation - obtenir le nombre total de categories
export const totalCategorie = async (_req: Request, res: Response) => {
  try {
    const count = await prisma.categorie.count();
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

