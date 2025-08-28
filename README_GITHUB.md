# 🚀 Powerteam Dashboard

## 📋 Vue d'ensemble

Dashboard moderne et intuitif pour cabinet comptable Powerteam, développé avec les dernières technologies Web 3.0. Une solution complète de gestion d'entreprise avec modules intégrés, intelligence artificielle et outils de présentation.

![Powerteam Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-blue)

## ✨ Fonctionnalités principales

### 🏠 Vue d'ensemble modulaire
- **10 blocs interactifs** avec données temps réel
- **Design responsive** adaptatif (mobile → desktop)
- **Règles de visibilité** selon le rôle (collaborateur/manager)
- **Navigation intuitive** vers tous les modules

### 📊 Modules complets
- **👥 Clients** : Gestion portefeuille, entrants/sortants, CA
- **💰 Finance** : Analyse intelligente, clients suspects, budgets vs réalisé
- **📈 Croissance** : Pipeline commercial, prospects, taux conversion
- **⚡ Production** : Planning, échéances, capacité, timesheet
- **🎯 RH** : Congés, formations, évaluations, bonus plans
- **🔧 Développement** : Plans correction Kanban, roadmap technique

### 🤖 Intelligence artificielle
- **Agent IA conversationnel** avec recommendations contextuelles
- **Chat intelligent** pour assistance et automation
- **Suggestions d'actions** basées sur les données

### 🎥 Meeting Builder
- **Bibliothèque de 52+ slides** connectées aux données
- **Templates de réunions** pré-configurés
- **Mode présentation** plein écran avec navigation
- **Prévisualisation** interactive des slides

## 🛠️ Technologies

### Frontend
- **React 18** avec TypeScript strict
- **Tailwind CSS** + Shadcn UI components
- **Lucide React** icons + Recharts visualisations
- **React Router** pour navigation SPA

### Architecture
- **Context API** pour gestion d'état globale
- **Hooks personnalisés** pour logique métier
- **Composants modulaires** réutilisables
- **Services** pour abstraction des données

### Design System
- **Web 3.0** avec glassmorphism et micro-animations
- **Accessibilité** intégrée (WCAG 2.1)
- **Performance** optimisée (lazy loading, memoization)
- **Responsive** first design

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Git

### Cloner le projet
\`\`\`bash
git clone https://github.com/yassineelbekkali21-bit/RefontePowerteam2.git
cd RefontePowerteam2
\`\`\`

### Installation des dépendances
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

### Démarrage en développement
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

Le dashboard sera accessible sur : **http://localhost:5173**

### Build de production
\`\`\`bash
npm run build
# ou
yarn build
\`\`\`

## 📁 Structure du projet

\`\`\`
src/
├── components/           # Composants réutilisables
│   ├── ui/              # Composants de base (Shadcn)
│   ├── layout/          # Layout et navigation
│   ├── clients/         # Composants module Clients
│   ├── dashboard/       # Composants vue d'ensemble
│   └── ...
├── contexts/            # Contexts React (état global)
├── hooks/               # Hooks personnalisés
├── pages/               # Pages principales des modules
├── services/            # Services et APIs
├── types/               # Types TypeScript
├── utils/               # Utilitaires et helpers
└── data/                # Données de test et mocks
\`\`\`

## 🎯 Modules détaillés

### Vue d'ensemble
- Blocs clients avec CA entrants/sortants
- Échéances urgentes (à planifier, en cours, retard)
- Planning synthétique du jour
- Plans en attente avec actions requises
- Congés restants et prochains jours fériés
- Clients suspects nécessitant attention
- CA réalisé vs budgété avec progress bar
- Capacité planning en temps réel
- Accès rapide Agent IA et Meeting Builder

### Module Finance
- **Vue d'ensemble** : Budgets annuels, réalisés, encours
- **Analyse intelligière** : Clients suspects avec règles automatiques
- **Budgets** : Suivi intelligent interconnecté

### Module Croissance
- **Vue globale** : KPIs et métriques principales
- **Prospects** : Pipeline avec taux conversion
- **Clients entrants** : Suivi onboarding et contacts
- **Clients à suivre** : Gestion risques et récupération
- **Clients en partance** : Prévention et récupération
- **Clients sortants** : Analyse des départs

## 🔧 Configuration

### Variables d'environnement
Créer un fichier \`.env.local\` :
\`\`\`env
VITE_API_URL=your_api_url
VITE_AI_API_KEY=your_ai_api_key
\`\`\`

### Personnalisation
- Modifier \`tailwind.config.ts\` pour les couleurs
- Adapter \`src/data/\` pour vos données
- Configurer \`src/services/\` pour vos APIs

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature (\`git checkout -b feature/AmazingFeature\`)
3. **Commit** vos changements (\`git commit -m 'Add AmazingFeature'\`)
4. **Push** vers la branche (\`git push origin feature/AmazingFeature\`)
5. **Ouvrir** une Pull Request

## 📝 Roadmap

- [ ] Intégration API backend
- [ ] Authentification et autorisations
- [ ] Notifications push en temps réel
- [ ] Export PDF des présentations
- [ ] Mode sombre
- [ ] Application mobile (React Native)
- [ ] Intégrations tierces (calendriers, emails)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier \`LICENSE\` pour plus de détails.

## 👨‍💻 Auteur

**Yassine El Bekkali**
- GitHub: [@yassineelbekkali21-bit](https://github.com/yassineelbekkali21-bit)
- Email: elbekkaliyass@gmail.com

## 🙏 Remerciements

- [Shadcn/ui](https://ui.shadcn.com/) pour les composants
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Lucide](https://lucide.dev/) pour les icônes
- [Recharts](https://recharts.org/) pour les graphiques

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous plaît !**
