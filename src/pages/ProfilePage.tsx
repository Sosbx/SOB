import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Save, Trash2 } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { LoginButton } from '../components/LoginButton';

function ProfilePage() {
  const { user } = useAuthStore();
  const { profile, updateProfile } = useUserStore();
  const [formData, setFormData] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    rpps: profile.rpps || '',
    adeli: profile.adeli || '',
    specialty: profile.specialty || 'Médecin généraliste',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const signatureRef = useRef<SignatureCanvas>(null);
  const [signatureLoaded, setSignatureLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Fonction pour mettre à jour les dimensions du canvas
  const updateCanvasSize = () => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setCanvasSize({ width, height: 160 }); // Hauteur fixe de 160px
    }
  };

  // Observer les changements de taille du conteneur
  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      rpps: profile.rpps || '',
      adeli: profile.adeli || '',
      specialty: profile.specialty || 'Médecin généraliste',
    });

    if (profile.signature && signatureRef.current && !signatureLoaded && canvasSize.width > 0) {
      const img = new Image();
      img.onload = () => {
        const canvas = signatureRef.current;
        if (canvas) {
          canvas.clear();
          const ctx = canvas.getCanvas().getContext('2d');
          if (ctx) {
            // Calculer le ratio pour maintenir les proportions
            const ratio = Math.min(
              (canvasSize.width * 0.8) / img.width,
              (canvasSize.height * 0.8) / img.height
            );

            const newWidth = img.width * ratio;
            const newHeight = img.height * ratio;

            // Centrer la signature dans le canvas
            const x = (canvasSize.width - newWidth) / 2;
            const y = (canvasSize.height - newHeight) / 2;

            ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            ctx.drawImage(img, x, y, newWidth, newHeight);
            setSignatureLoaded(true);
          }
        }
      };
      img.src = profile.signature;
    }
  }, [profile, signatureLoaded, canvasSize]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    if (!/^\d+$/.test(formData.rpps)) {
      newErrors.rpps = 'Le RPPS doit contenir uniquement des chiffres';
    }
    if (!/^\d+$/.test(formData.adeli)) {
      newErrors.adeli = 'Le numéro ADELI doit contenir uniquement des chiffres';
    }
    if (!formData.specialty.trim()) {
      newErrors.specialty = 'La spécialité est requise';
    }
    if (!signatureRef.current?.toData().length && !profile.signature) {
      newErrors.signature = 'La signature est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Veuillez vous connecter pour enregistrer votre profil');
      return;
    }

    if (validateForm()) {
      const canvas = signatureRef.current?.getCanvas();
      let signatureDataUrl = profile.signature;
      
      if (canvas && signatureRef.current?.toData().length) {
        signatureDataUrl = canvas.toDataURL();
      }

      try {
        await updateProfile({
          ...formData,
          signature: signatureDataUrl,
        });
        alert('Profil enregistré avec succès');
      } catch (error) {
        alert('Erreur lors de l\'enregistrement du profil');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const clearSignature = async () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureLoaded(false);
      if (errors.signature) {
        setErrors(prev => ({ ...prev, signature: '' }));
      }
      
      try {
        await updateProfile({
          ...formData,
          signature: null,
        });
      } catch (error) {
        console.error('Erreur lors de la suppression de la signature:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Connexion requise</h2>
          <p className="text-gray-600 mb-4">
            Veuillez vous connecter pour accéder à votre profil médecin
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profil Médecin</h2>
          <LoginButton />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                RPPS
              </label>
              <input
                type="text"
                name="rpps"
                value={formData.rpps}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.rpps ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.rpps && (
                <p className="mt-1 text-sm text-red-600">{errors.rpps}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ADELI
              </label>
              <input
                type="text"
                name="adeli"
                value={formData.adeli}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.adeli ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.adeli && (
                <p className="mt-1 text-sm text-red-600">{errors.adeli}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Spécialité
            </label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.specialty ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.specialty && (
              <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature
            </label>
            <div ref={containerRef} className="border border-gray-300 rounded-lg p-2 bg-white">
              {canvasSize.width > 0 && (
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    className: 'w-full h-full border rounded-lg',
                    style: { 
                      background: 'white',
                    }
                  }}
                  dotSize={1}
                  minWidth={1}
                  maxWidth={2}
                  throttle={16}
                  backgroundColor="rgb(255, 255, 255)"
                />
              )}
            </div>
            {errors.signature && (
              <p className="mt-1 text-sm text-red-600">{errors.signature}</p>
            )}
            <button
              type="button"
              onClick={clearSignature}
              className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Effacer la signature
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;