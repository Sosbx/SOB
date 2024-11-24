import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Settings, Star } from 'lucide-react';
import { useEchoStore } from '../../store/echoStore';

const CATEGORIES = {
  'all': 'Tous',
  'renal': 'Rénal',
  'pleuropulmonaire': 'Pleuro-pulmonaire',
  'tvp': 'TVP',
  'fast': 'FAST',
  'perso': 'Personnalisé'
};

const EchoFavorites: React.FC = () => {
  const { favorites, loadFavorites, addFavorite, updateFavorite, deleteFavorite } = useEchoStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFavorite, setEditingFavorite] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newFavorite, setNewFavorite] = useState({
    title: '',
    content: '',
    category: 'renal'
  });

  useEffect(() => {
    loadFavorites();
  }, []);

  const filteredFavorites = favorites.filter(favorite => 
    selectedCategory === 'all' || favorite.category === selectedCategory
  );

  const handleSave = async () => {
    if (editingFavorite) {
      await updateFavorite(editingFavorite.id, {
        title: newFavorite.title,
        content: newFavorite.content,
        category: newFavorite.category
      });
      setEditingFavorite(null);
    } else {
      await addFavorite(newFavorite);
    }
    setShowAddModal(false);
    setNewFavorite({ title: '', content: '', category: 'renal' });
  };

  const handleEdit = (favorite: any) => {
    setEditingFavorite(favorite);
    setNewFavorite({
      title: favorite.override?.title || favorite.title,
      content: favorite.override?.content || favorite.content,
      category: favorite.override?.category || favorite.category
    });
    setShowAddModal(true);
  };

  const handleDelete = async (favorite: any) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce favori ?')) {
      await deleteFavorite(favorite.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-indigo-900">Mes Favoris</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {Object.entries(CATEGORIES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEditMode 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Settings className="h-4 w-4" />
            {isEditMode ? 'Terminer' : 'Modifier'}
          </button>
          <button
            onClick={() => {
              setEditingFavorite(null);
              setNewFavorite({ title: '', content: '', category: 'renal' });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouveau favori
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredFavorites.map((favorite) => (
          <div
            key={favorite.id}
            className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-all"
          >
            <button
              onClick={() => !isEditMode && useEchoStore.setState({ report: favorite.content })}
              className="w-full p-4 text-left transition-colors bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold line-clamp-1">
                  {favorite.override?.title || favorite.title}
                </span>
              </div>
              <span className="text-xs text-gray-500 block">
                {CATEGORIES[favorite.override?.category || favorite.category as keyof typeof CATEGORIES]}
              </span>
            </button>

            {isEditMode && (
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => handleEdit(favorite)}
                  className="p-1.5 text-indigo-600 hover:text-indigo-700 rounded-full hover:bg-white/80 bg-white/50"
                  title="Modifier"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(favorite)}
                  className="p-1.5 text-red-600 hover:text-red-700 rounded-full hover:bg-white/80 bg-white/50"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-indigo-900">
                {editingFavorite ? 'Modifier le favori' : 'Nouveau favori'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingFavorite(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  value={newFavorite.title}
                  onChange={(e) => setNewFavorite(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Catégorie
                </label>
                <select
                  value={newFavorite.category}
                  onChange={(e) => setNewFavorite(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {Object.entries(CATEGORIES).filter(([key]) => key !== 'all').map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contenu
                </label>
                <textarea
                  value={newFavorite.content}
                  onChange={(e) => setNewFavorite(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingFavorite(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  {editingFavorite ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EchoFavorites;