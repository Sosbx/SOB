import { jsPDF } from 'jspdf';

interface PatientInfo {
  lastName: string;
  firstName: string;
  birthDate?: string;
}

interface DoctorInfo {
  firstName: string;
  lastName: string;
  rpps: string;
  adeli: string;
  specialty: string;
  signature: string | null;
}

const addLogo = (doc: jsPDF): Promise<number> => {
  return new Promise((resolve) => {
    const startY = 15;
    const logoWidth = 60;
    const logoHeight = 20;
    const logoX = 15;

    const img = new Image();
    img.src = '/logo-sosmedecins.png';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', logoX, startY, logoWidth, logoHeight);
        }
        resolve(startY + logoHeight + 10);
      } catch (error) {
        console.warn('Logo non disponible:', error);
        resolve(startY);
      }
    };

    img.onerror = () => {
      console.warn('Impossible de charger le logo');
      resolve(startY);
    };
  });
};

const addDoctorInfo = (doc: jsPDF, doctorInfo: DoctorInfo, startY: number): number => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Dr. ${doctorInfo.firstName} ${doctorInfo.lastName}`, 15, startY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`RPPS : ${doctorInfo.rpps}`, 15, startY + 7);
  doc.text(`ADELI : ${doctorInfo.adeli}`, 15, startY + 14);
  doc.text(doctorInfo.specialty || 'Médecin généraliste', 15, startY + 21);
  
  return startY + 30;
};

const addDate = (doc: jsPDF, startY: number): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(today, pageWidth - 15, startY, { align: 'right' });
};

const addPatientInfo = (doc: jsPDF, patientInfo: PatientInfo, startY: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  
  const patientText = `${patientInfo.lastName.toUpperCase()} ${patientInfo.firstName}`;
  const textX = pageWidth / 2;
  const textY = startY + 10;
  
  const patientTextWidth = doc.getTextWidth(patientText);
  doc.text(patientText, textX, textY, { align: 'center' });
  doc.line(
    textX - (patientTextWidth / 2),
    textY + 1,
    textX + (patientTextWidth / 2),
    textY + 1
  );
  
  if (patientInfo.birthDate) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const birthDateText = `Né(e) le ${new Date(patientInfo.birthDate).toLocaleDateString('fr-FR')}`;
    doc.text(birthDateText, textX, textY + 8, { align: 'center' });
    return textY + 20;
  }
  
  return textY + 12;
};

const addSeparator = (doc: jsPDF, startY: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setDrawColor(200, 200, 200);
  doc.line(15, startY, pageWidth - 15, startY);
  return startY + 15;
};

const addPrescriptionContent = (
  doc: jsPDF,
  prescription: string,
  startY: number,
  isAld: boolean,
  aldPrescription?: string
): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  if (isAld) {
    let currentY = startY;
    
    if (aldPrescription?.trim()) {
      currentY = addAldSection(doc, currentY, aldPrescription);
    }
    
    if (prescription.trim()) {
      currentY = addNormalSection(doc, currentY, prescription);
    }
    
    return currentY;
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    const splitPrescription = doc.splitTextToSize(prescription, pageWidth - 30);
    const textHeight = splitPrescription.length * 7;
    
    doc.text(splitPrescription, 15, startY);
    
    return startY + textHeight + 20;
  }
};

const addAldSection = (doc: jsPDF, startY: number, text: string): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setDrawColor(0, 0, 0);
  doc.line(15, startY, pageWidth - 15, startY);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Prescriptions relatives au traitement de l\'affection de longue durée reconnue (liste ou hors liste)', pageWidth / 2, startY + 5, { align: 'center' });
  
  doc.line(15, startY + 8, pageWidth - 15, startY + 8);
  
  doc.setFont('helvetica', 'normal');
  const splitText = doc.splitTextToSize(text, pageWidth - 30);
  const textHeight = splitText.length * 7;
  doc.text(splitText, 15, startY + 15);
  
  return startY + textHeight + 25;
};

const addNormalSection = (doc: jsPDF, startY: number, text: string): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setDrawColor(0, 0, 0);
  doc.line(15, startY, pageWidth - 15, startY);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Prescriptions SANS RAPPORT avec l\'affection longue durée', pageWidth / 2, startY + 5, { align: 'center' });
  
  doc.line(15, startY + 8, pageWidth - 15, startY + 8);
  
  doc.setFont('helvetica', 'normal');
  const splitText = doc.splitTextToSize(text, pageWidth - 30);
  const textHeight = splitText.length * 7;
  doc.text(splitText, 15, startY + 15);
  
  return startY + textHeight + 25;
};

const addSignature = (doc: jsPDF, signature: string | null, startY: number): void => {
  if (!signature) return;
  
  try {
    const pageWidth = doc.internal.pageSize.getWidth();
    const signatureWidth = 90;
    const signatureHeight = 40;
    const signatureX = pageWidth - signatureWidth - 15;
    
    doc.addImage(signature, 'PNG', signatureX, startY - signatureHeight, signatureWidth, signatureHeight);
  } catch (error) {
    console.warn('Erreur lors de l\'ajout de la signature:', error);
  }
};

const addFooter = (doc: jsPDF): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.setFont('helvetica', 'normal');
  
  const footerLines = [
    'Http://www.sosmedecins-bordeaux.com',
    'CONSULTATIONS SUR RENDEZ-VOUS : 05.56.48.75.59',
    'VISITES A DOMICILE : 05 56 44 74 74',
    '',
    'Membre d\'une association de gestion agréé, le règlement des honoraires par chèque et CB est accepté.'
  ];
  
  let yPosition = pageHeight - 25;
  const lineHeight = 3.5;
  
  footerLines.forEach((line) => {
    doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += lineHeight;
  });
};

export const generatePrescriptionPDF = async (
  prescription: string,
  patientInfo: PatientInfo,
  doctorInfo: DoctorInfo,
  isAld: boolean = false,
  aldPrescription?: string
): Promise<jsPDF> => {
  try {
    const doc = new jsPDF();
    
    const startY = await addLogo(doc);
    const doctorEndY = addDoctorInfo(doc, doctorInfo, startY);
    addDate(doc, startY);
    const patientEndY = addPatientInfo(doc, patientInfo, doctorEndY);
    const separatorEndY = addSeparator(doc, patientEndY);
    const textEndY = addPrescriptionContent(doc, prescription, separatorEndY, isAld, aldPrescription);
    addSignature(doc, doctorInfo.signature, textEndY);
    addFooter(doc);
    
    return doc;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw new Error('Impossible de générer le PDF. Veuillez réessayer.');
  }
};