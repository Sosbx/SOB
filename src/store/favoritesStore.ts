import { create } from 'zustand';
import { doc, collection, getDocs, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from './authStore';

// Favoris initiaux triés par ordre alphabétique
const DEFAULT_FAVORITES = {
  'angine-strepta-minus': {
    title: 'Angine Strepta -',
    content: `- Mal de gorge
- Dysphagie
- Fièvre
- Adénopathies cervicales sensibles
Examen de la gorge :
- Amygdales hypertrophiées
- Érythème pharyngé
- Exsudat blanchâtre sur les amygdales

Streptatest : Négatif`,
    category: 'orl',
    order: 1
  },
  'angine-strepta-plus': {
    title: 'Angine Strepta +',
    content: `- Mal de gorge
- Dysphagie
- Fièvre
- Adénopathies cervicales sensibles
Examen de la gorge :
- Amygdales hypertrophiées
- Érythème pharyngé
- Exsudat blanchâtre sur les amygdales

Streptatest : Positif`,
    category: 'orl',
    order: 2
  },
  'colique-nephretique': {
    title: 'Clq néphrétique',
    content: `Colique néphrétique :
- Douleur lombaire unilatérale brutale
- Irradiation vers les organes génitaux externes
- Agitation
- Nausées, vomissements

Examen clinique :
- Bon état général
- Douleur à la palpation de la fosse lombaire
- Absence de fièvre
- Bandelette urinaire : hématurie`,
    category: 'uro',
    order: 3
  },
  'conjonctivite': {
    title: 'Conjonctivite',
    content: `- Oeil rouge
- Prurit
- Écoulement purulent
- Larmoiement 
- Sensation de corps étranger`,
    category: 'other',
    order: 4
  },
  'coqueluche': {
    title: 'Coqueluche',
    content: `Suspicion de coqueluche :
- Toux persistante
- Quinteuse, émétisante à prédominance nocturne
- Reprise inspiratoire bruyante

Examen clinique :
- État général conservé
- Apyrexie ou fièvre modérée
- Auscultation pulmonaire normale
- Pas de détresse respiratoire`,
    category: 'pneumo',
    order: 5
  },
  'cystite': {
    title: 'Cystite',
    content: `- Brûlure mictionnelle
- Pollakiurie
- Hématurie
- Apyrétique
- Fosse lombaire libre
- Pas de globe`,
    category: 'uro',
    order: 6
  },
  'deces': {
    title: 'Décès',
    content: `- Identité du patient verifiée
- Absence de ventilation spontanée
- Pupilles en mydriase et aréactives
- Bdc inaudibles
- Pas de pouls
- Rigidité cadavérique`,
    category: 'other',
    order: 7
  },
  'depression': {
    title: 'Dépression',
    content: `Dépression :
- Humeur triste
- Anhédonie
- Troubles du sommeil
- Perte d'appétit
- Fatigue
- Difficultés de concentration

Examen clinique :
- Patient conscient, orienté
- Pas d'idées suicidaires exprimées
- Pas de délire ni d'hallucinations
- Pas de risque de passage à l'acte immédiat`,
    category: 'psy',
    order: 8
  },
  'examen-normal': {
    title: 'Examen normal',
    content: `Examen général:
- Bon état général
- Constantes normales
- Pas de signe de gravité
Cardio:
- Pas de douleur thoracique
- Bruits du cœur réguliers
- Pas de signe d'insuffisance cardiaque
Pneumo:
- Eupnéique
- MV +/+
- Pas de BSA
Neuro:
- Pas de DSM
- Pas de syndrome méningé
Abdo:
- Abdomen souple dépressible indolore
- Pas de défense
- Pas de trouble du transit`,
    category: 'general',
    order: 9
  },
  'gastro': {
    title: 'Gastro',
    content: `Diarrhée, nausée, vomissements

Examen général:
- Bon état général
- Pas de signe de déshydratation
Abdo:
- Abdomen souple dépressible, sensible dans son ensemble
- Pas de défense
- Pas de contracture`,
    category: 'gastro',
    order: 10
  },
  'lumbago': {
    title: 'Lumbago',
    content: `Douleur lombaire d'apparition brutale,
- Marche sans aide
- Contracture des muscles paravertébraux
- Lasègue négatif 
- Léri négatif
- Pas de déficit sensitivo-moteur des membres inférieurs
- Pouls périphériques perçus et symétriques`,
    category: 'trauma',
    order: 11
  },
  'migraine': {
    title: 'Migraine',
    content: `Migraine :
- Céphalées unilatérales pulsatiles
- Photophobie, phonophobie
- Nausées, vomissements

Examen clinique :
- Bon état général
- Migraine similaire aux autres crises
Examen neuro:
- Pas de signe de gravité
- Pas de trouble du comportement
- RPM symétriques et consensuels
- Paires crâniennes normales
- Pas de déficit sensitif
- Pas de déficit moteur
- Pas de syndrome méningé`,
    category: 'neuro',
    order: 12
  },
  'oma': {
    title: 'OMA',
    content: `Otalgie
Tympan:
- Congestif
- Inflammatoire
- Perte de transparence 
- Collecté`,
    category: 'orl',
    order: 13
  },
  'sinusite-frontale': {
    title: 'Sinusite frontale',
    content: `- Fièvre/Frissons
- Myalgies diffuses
- Céphalées retro orbitaire
- Céphalées augmentée à la mobilisation de la tête

Examen clinique :
- Bon état général
- Pas de signe de gravité
- Auscultation claire, pas de foyer
- Pas de sd méningé
- Pas d'autre point d'appel infectieux retrouvé`,
    category: 'orl',
    order: 14
  },
  'sinusite-maxillaire': {
    title: 'Sinusite maxillaire',
    content: `- Fièvre/Frissons
- Myalgies diffuses
- Douleurs retro maxillaire/sous orbitaire
- Augmentée à la mobilisation de la tête

Examen clinique :
- Bon état général
- Pas de signe de gravité
- Auscultation claire, pas de foyer
- Pas de sd méningé
- Pas d'autre point d'appel infectieux retrouvé`,
    category: 'orl',
    order: 15
  },
  'syndrome-grippal': {
    title: 'Sd grippal',
    content: `- Fièvre
- Frissons
- Asthénie
- Myalgies diffuses
- Céphalées
- Toux sèche

Examen clinique :
- Bon état général
- Pas de signe de gravité
- Auscultation claire, pas de foyer
- Pas de sd méningé
- Pas d'autre point d'appel infectieux retrouvé`,
    category: 'general',
    order: 16
  }
};

export interface FavoriteTemplate {
  id: string;
  title: string;
  content: string;
  isSystem?: boolean;
  category: string;
  order: number;
  hidden?: boolean;
  override?: {
    title?: string;
    content?: string;
    category?: string;
  };
}

interface FavoritesState {
  favorites: FavoriteTemplate[];
  loading: boolean;
  error: string | null;
  loadFavorites: () => Promise<void>;
  addFavorite: (favorite: Omit<FavoriteTemplate, 'id'>) => Promise<void>;
  updateFavorite: (id: string, favorite: Partial<FavoriteTemplate>) => Promise<void>;
  deleteFavorite: (id: string) => Promise<void>;
  reorderFavorites: (favorites: FavoriteTemplate[]) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loading: false,
  error: null,

  loadFavorites: async () => {
    const { user } = useAuthStore.getState();

    try {
      set({ loading: true, error: null });

      // Convertir les favoris par défaut en tableau
      const defaultFavorites = Object.entries(DEFAULT_FAVORITES).map(([id, favorite]) => ({
        ...favorite,
        id,
        isSystem: true
      }));

      let userFavorites: FavoriteTemplate[] = [];
      let userOverrides: { [key: string]: any } = {};

      if (user) {
        // Charger les favoris personnalisés
        const userFavoritesRef = collection(db, `users/${user.uid}/favorites`);
        const userSnapshot = await getDocs(userFavoritesRef);
        userFavorites = userSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          isSystem: false
        })) as FavoriteTemplate[];

        // Charger les modifications des favoris par défaut
        const overridesRef = collection(db, `users/${user.uid}/overrides`);
        const overridesSnapshot = await getDocs(overridesRef);
        userOverrides = Object.fromEntries(
          overridesSnapshot.docs.map(doc => [doc.id, doc.data()])
        );
      }

      // Appliquer les modifications aux favoris par défaut
      const modifiedDefaultFavorites = defaultFavorites.map(favorite => {
        const override = userOverrides[favorite.id];
        if (override) {
          return {
            ...favorite,
            ...override,
            override
          };
        }
        return favorite;
      });

      // Combiner et trier les favoris par ordre alphabétique du titre
      const allFavorites = [
        ...modifiedDefaultFavorites.filter(sf => !sf.hidden),
        ...userFavorites
      ].sort((a, b) => {
        const titleA = (a.override?.title || a.title).toLowerCase();
        const titleB = (b.override?.title || b.title).toLowerCase();
        return titleA.localeCompare(titleB);
      });

      set({ favorites: allFavorites, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addFavorite: async (favorite) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      
      const userFavoritesRef = collection(db, `users/${user.uid}/favorites`);
      const newFavoriteRef = doc(userFavoritesRef);
      
      const currentFavorites = get().favorites;
      const maxOrder = Math.max(...currentFavorites.map(f => f.order), 0);
      
      await setDoc(newFavoriteRef, {
        ...favorite,
        order: maxOrder + 1,
        createdAt: new Date()
      });

      await get().loadFavorites();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateFavorite: async (id: string, favorite: Partial<FavoriteTemplate>) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      const existingFavorite = get().favorites.find(f => f.id === id);

      if (existingFavorite?.isSystem) {
        // Pour les favoris par défaut, stocker les modifications dans la collection overrides
        const overrideRef = doc(db, `users/${user.uid}/overrides/${id}`);
        await setDoc(overrideRef, {
          ...favorite,
          updatedAt: new Date()
        }, { merge: true });
      } else {
        // Pour les favoris personnalisés, mettre à jour directement
        const favoriteRef = doc(db, `users/${user.uid}/favorites/${id}`);
        await updateDoc(favoriteRef, {
          ...favorite,
          updatedAt: new Date()
        });
      }

      await get().loadFavorites();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteFavorite: async (id: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      const existingFavorite = get().favorites.find(f => f.id === id);

      if (existingFavorite?.isSystem) {
        // Pour les favoris par défaut, marquer comme masqué dans les overrides
        const overrideRef = doc(db, `users/${user.uid}/overrides/${id}`);
        await setDoc(overrideRef, {
          hidden: true,
          updatedAt: new Date()
        }, { merge: true });
      } else {
        // Pour les favoris personnalisés, supprimer
        const favoriteRef = doc(db, `users/${user.uid}/favorites/${id}`);
        await deleteDoc(favoriteRef);
      }

      await get().loadFavorites();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  reorderFavorites: async (favorites: FavoriteTemplate[]) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      
      const batch = db.batch();
      favorites.forEach((favorite, index) => {
        if (!favorite.isSystem) {
          const favoriteRef = doc(db, `users/${user.uid}/favorites/${favorite.id}`);
          batch.update(favoriteRef, { order: index });
        }
      });
      
      await batch.commit();
      set({ favorites, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));