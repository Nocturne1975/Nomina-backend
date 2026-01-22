Présenté par : Sonia Corbin Date : 05/11/2025

# NOMINA — API Génératrice & Narratrice de Noms

Nomina s’inscrit dans l’industrie du logiciel et de la création numérique, en proposant une API innovante dédiée à la narration et à la génération de noms.

Slogan court (suggestion pour logo) : **Créez, Nommez, Racontez**

* * *
## Installation & Lancement

1. Clonez le dépôt et installez les dépendances : git clone https://github.com/Nocturne1975/Nomina-backend
   cd Nomina-backend
   npm install

2. Configurez le fichier `.env` à la racine :
   DATABASE_URL=postgresql://...
  CLERK_SECRET_KEY=sk_live_...
  ADMIN_CLERK_USER_ID=user_...
  CORS_ORIGIN=http://localhost:5173

3. Lancez le serveur :  npm run dev
  
4. Testez l’API avec le fichier `test.rest` (VS Code) ou Postman.

## Web + Desktop + Offline

- Le backend peut être déployé (API en ligne) et consommé par un **site web** et une **app Electron**.
- CORS est configurable via `CORS_ORIGIN` (liste séparée par virgules). L'app Electron peut ne pas envoyer d'en-tête `Origin`.
- Le mode offline se fait côté client (cache GET + outbox) et ne nécessite pas de changement côté API.

## Endpoints principaux

| Méthode | Endpoint                  | Description                  |
|---------|---------------------------|------------------------------|
| GET     | /users                    | Liste tous les utilisateurs  |
| POST    | /users                    | Crée un utilisateur          |
| ...     | ...                       | ...                          |

## Schéma ER

Le schéma ER est disponible à la racine du dépôt sous forme d’image/PDF.


## Table des matières

- [NOMINA — API Génératrice \& Narratrice de Noms]
  - [Installation \& Lancement]
  - [Endpoints principaux]
  - [Schéma ER]
  - [Table des matières]
  - [Présentation]
  - [Utilisateurs cibles]
  - [Objectifs]
  - [Fonctionnalités principales]
  - [Spécification API (exemples)]
    - [POST /generate-name]
    - [POST /generate-place]
  - [Exemples d'utilisation]
    - [curl]
    - [Client Python (exemple minimal)]
  - [Architecture technique (version locale / gratuite)]
  - [Design \& Branding]
    - [Palette \& typographie]
    - [Iconographie recommandée (pour logo)]
    - [Slogans courts possibles (pour le logo)]
  - [Déploiement (options simples)]
  - [Contribution \& contact]
  - [Licence]
  - [Annexes (à inclure dans le dossier)]

* * *

## Présentation

Nomina est une API destinée à générer des noms (personnages, lieux, objets, créatures) accompagnés, si souhaité, d'une mini-description ou d'une mini-biographie narrative. L’idée est d’aider développeurs, auteurs et créateurs à trouver rapidement des noms évocateurs et porteurs d’histoire.

* * *

## Utilisateurs cibles

Nomina vise principalement les utilisateurs suivants :

1.  Développeurs
    -   Intègrent la génération de noms et de mini-histoires dans leurs applications (jeux, sites web, outils, chatbots...).
    -   Développeurs de jeux vidéo, jeux de rôle, applis d’écriture, etc.
2.  Auteurs et écrivains
    -   Romans, nouvelles, BD, scénarios, en quête d’inspiration pour personnages, lieux ou objets.
3.  Maîtres de jeu (MJ) et joueurs de jeux de rôle
    -   Création rapide de PNJ, villes, objets magiques, etc., avec une touche narrative.
4.  Créateurs de contenu
    -   YouTubers, podcasteurs, blogueurs, streamers cherchant noms et idées pour leurs univers.
5.  Entrepreneurs et marketeurs
    -   Brainstorming de noms de marque, produits ou projets, avec un angle narratif différenciant.
6.  Chercheurs et enseignants
    -   Ateliers d’écriture, projets pédagogiques sur créativité, linguistique ou histoire.

* * *

## Objectifs

-   Fournir une API simple et rapide pour générer des noms thématiques et personnalisables.
-   Offrir des suggestions narratives (mini-histoires) associées aux noms.
-   Être facilement intégrable (RESTful, JSON) et utilisable en local ou hébergé sur des plateformes simples.
-   Rester extensible (ajout futur de modèles, langues, export, interface web, etc.).

* * *

## Fonctionnalités principales

-   Génération de noms : aléatoire, thématique (fantasy, contemporain, futuriste, historique).
-   Paramètres de personnalisation : genre, culture, longueur, consonance, type (personnage, lieu, objet).
-   Génération de mini-histoires/biographies associées au nom.
-   Endpoints REST simples, réponses JSON, documentation claire.
-   Possibilité d’utiliser une base locale (SQLite) ou une base plus riche (MongoDB).

* * *

## Spécification API (exemples)

Les routes ci-dessous sont des exemples pour documenter le format attendu.

### POST /generate-name

-   Description : Génère un nom de personne ou de créature.
-   URL : `/generate-name`
-   Méthode : POST
-   Body (JSON) — champs possibles :
    -   `genre` : "M" | "F" | "NB" (optionnel)
    -   `culture` : string (ex. "Nordique", "Médiévale", "Futuriste")
    -   `theme` : string (ex. "Fantasy", "Contemporain")
    -   `length` : int (désirée : 3..15)
    -   `with_story` : bool (ajouter une mini-histoire)
-   Exemple de requête :

```json
{
  "genre": "F",
  "culture": "Nordique",
  "theme": "Fantasy",
  "with_story": true
}
```

-   Exemple de réponse :

```json
{
  "name": "Astridr",
  "story": "Née sous les aurores boréales, Astridr est destinée à devenir une grande guerrière des terres du Nord."
}
```

### POST /generate-place

-   Description : Génère un nom et une description pour un lieu (ville, région, lieu magique).
-   URL : `/generate-place`
-   Méthode : POST
-   Body (JSON) — champs possibles :
    -   `type` : "ville" | "région" | "site" ...
    -   `theme` : string (ex. "Futuriste")
    -   `size` : "small" | "medium" | "large" (optionnel)
-   Exemple de requête :

```json
{
  "type": "ville",
  "theme": "Futuriste"
}
```

-   Exemple de réponse :

```json
{
  "name": "Neotropolis",
  "description": "Capitale technologique où l'humain et la machine vivent en harmonie."
}
```

* * *

## Exemples d'utilisation

### curl

```bash
curl -X POST "http://localhost:8000/generate-name" \
  -H "Content-Type: application/json" \
  -d '{"genre":"F","culture":"Nordique","theme":"Fantasy","with_story":true}'
```

### Client Python (exemple minimal)

```python
import requests

url = "http://localhost:8000/generate-name"
payload = {
    "genre": "F",
    "culture": "Nordique",
    "theme": "Fantasy",
    "with_story": True
}
r = requests.post(url, json=payload)
print(r.json())
```

* * *

## Architecture technique (version locale / gratuite)

-   Backend : Python + FastAPI (léger, rapide pour prototyper)
-   DB (option locale simple) : SQLite — suffisant pour prototypage
-   DB (option évoluée) : MongoDB si tu veux stocker modèles / jeux de noms
-   Hébergement : local (localhost) ou plateformes simples / gratuites : Render, Railway, Vercel (pour fonctions serverless)
-   Sécurité : endpoints protégés par token (JWT possible), éventuellement rate limiting si public

Schéma simplifié : Utilisateur → Front (web/app) → API Nomina (FastAPI) → BD (SQLite/MongoDB) → Résultat

* * *

## Design & Branding

### Palette & typographie

-   Fond : bleu nuit / gris foncé (#0f1724 ou #1b2430)
-   Couleur principale : bleu-turquoise / vert d’eau (#36c6c6 ou #5fd7d7)
-   Accent : blanc cassé (#f7f7f7) ou doré léger pour détails
-   Police recommandée : fonte moderne et lisible (ex. Montserrat, Poppins, Lora pour le serif)

### Iconographie recommandée (pour logo)

-   Plume stylisée (écriture) + encrier (narration)
-   Petit engrenage discret (tech/API) intégré à la base de l’encrier
-   Petite étoile ou pixel proche de la plume (inspiration numérique)
-   Variante monochrome pour favicon / icône d’app

### Slogans courts possibles (pour le logo)

-   Créez, Nommez, Racontez
-   L’art du nom, la magie du récit
-   Des noms, des histoires

* * *

## Déploiement (options simples)

-   Local : `uvicorn main:app --reload --host 0.0.0.0 --port 8000`
-   Render / Railway : connecte ton repo GitHub, choisis build command (ex. `pip install -r requirements.txt`) et run command (`uvicorn main:app --host 0.0.0.0 --port $PORT`).
-   Vercel : plutôt pour front / serverless functions (si tu veux transformer certains endpoints en serverless).

Annexe rapide "requirements.txt" typique :

```
fastapi
uvicorn[standard]
pydantic
aiohttp
requests
python-dotenv
```

* * *

## Contribution & contact

-   Pour contributions : crée une issue / PR sur le dépôt GitHub (lien à ajouter).
-   Pour retours : [contact@nomina.example](mailto:contact@nomina.example) (remplace par ton email réel).

Modèle de phrase (dans le README du repo) :

> Nomina est un projet en cours. Contributions, idées et retours sont les bienvenus — ouvre une issue ou contacte-moi directement.

* * *

## Licence

Indique la licence choisie (ex. MIT, Apache-2.0). Exemple :

-   MIT License — voir fichier LICENSE.

* * *

## Annexes (à inclure dans le dossier)

-   `docs/` : documentation détaillée des endpoints, exemples supplémentaires
-   `assets/` : logos, icônes, palette couleur (PNG / SVG)
-   `examples/` : scripts d'exemple (client Python, Node.js), mock data
-   `LICENSE` : fichier de licence
-   `CONTRIBUTING.md` : guide de contribution
