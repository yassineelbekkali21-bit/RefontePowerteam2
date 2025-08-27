# Dashboard Entreprise

Un dashboard moderne et complet pour la gestion d'entreprise, développé avec React, TypeScript et Tailwind CSS.

## Fonctionnalités

- **Vue d'ensemble** : Indicateurs clés de performance et métriques principales
- **Production** : Suivi de la production, gestion des équipes et des dossiers
- **Finance** : Gestion budgétaire, analyse de rentabilité et suivi financier
- **RH** : Gestion des ressources humaines, plans de développement et bonus
- **Planification** : Calendrier, échéances et gestion des plans

## Technologies utilisées

- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **Shadcn/ui** pour les composants UI
- **Recharts** pour les graphiques
- **Jest** pour les tests

## Installation

```bash
# Cloner le projet
git clone <repository-url>
cd dashboard-entreprise

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour la production
npm run build
```

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualise le build de production
- `npm run lint` - Lance ESLint
- `npm run test` - Lance les tests Jest
- `npm run test:watch` - Lance les tests en mode watch
- `npm run test:coverage` - Lance les tests avec couverture

## Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── dashboard/      # Composants spécifiques au dashboard
│   ├── layout/         # Composants de mise en page
│   └── ui/            # Composants UI de base
├── pages/             # Pages de l'application
├── services/          # Services et logique métier
├── types/             # Définitions TypeScript
├── utils/             # Utilitaires et helpers
└── lib/               # Configuration et utilitaires de base
```

## Fonctionnalités avancées

- **Sidebar contextuelle** : Affichage d'informations détaillées au clic
- **Gestion d'erreurs** : Système robuste de gestion et logging des erreurs
- **Transformation de données** : Utilitaires complets pour le formatage et la validation
- **Tests unitaires** : Couverture complète avec Jest
- **Responsive design** : Interface adaptée à tous les écrans

## Développement

Le projet utilise une architecture modulaire avec :

- Composants réutilisables et typés
- Services pour la gestion des données
- Système de gestion d'erreurs centralisé
- Tests unitaires pour la fiabilité
- Configuration TypeScript stricte

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## Licence

Ce projet est sous licence MIT.