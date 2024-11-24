import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

export const sendPdfByEmail = async (
  pdfBlob: Blob,
  email: string,
  patientName: string
): Promise<void> => {
  try {
    // Créer une référence unique pour le PDF
    const pdfRef = ref(storage, `prescriptions/${Date.now()}_${patientName}.pdf`);
    
    // Uploader le PDF
    await uploadBytes(pdfRef, pdfBlob);
    
    // Obtenir l'URL de téléchargement
    const pdfUrl = await getDownloadURL(pdfRef);
    
    // Appeler la Cloud Function pour envoyer l'email
    const sendEmail = httpsCallable(functions, 'sendPrescriptionEmail');
    await sendEmail({
      email,
      pdfUrl,
      patientName
    });
    
    // Le PDF sera automatiquement supprimé par une Cloud Function après 24h
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Impossible d\'envoyer l\'email. Veuillez réessayer.');
  }
};