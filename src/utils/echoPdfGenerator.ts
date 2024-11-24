import { jsPDF } from 'jspdf';

interface PatientInfo {
  lastName: string;
  firstName: string;
  birthDate: string;
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

const addHeader = (doc: jsPDF, doctorInfo: DoctorInfo, patientInfo: PatientInfo, startY: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Informations du médecin (à gauche)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Dr. ${doctorInfo.firstName} ${doctorInfo.lastName}`, 15, startY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`RPPS : ${doctorInfo.rpps}`, 15, startY + 7);
  doc.text(`ADELI : ${doctorInfo.adeli}`, 15, startY + 14);
  doc.text(doctorInfo.specialty || 'Médecin généraliste', 15, startY + 21);

  // Informations du patient (à droite)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const patientX = pageWidth - 15;
  doc.text([
    `Patient: ${patientInfo.lastName.toUpperCase()} ${patientInfo.firstName}`,
    `Né(e) le: ${new Date(patientInfo.birthDate).toLocaleDateString('fr-FR')}`,
    `Date: ${new Date().toLocaleDateString('fr-FR')}`
  ], patientX, startY, { align: 'right' });

  return startY + 35;
};

const addTitle = (doc: jsPDF, startY: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('COMPTE RENDU D\'ÉCHOGRAPHIE', pageWidth / 2, startY, { align: 'center' });
  
  return startY + 20;
};

const formatContent = (content: string): { type: string; text: string; section?: string }[] => {
  const lines = content.split('\n');
  const formattedContent: { type: string; text: string; section?: string }[] = [];
  let currentSection = '';

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      formattedContent.push({ type: 'empty', text: '' });
    } else if (trimmedLine.toLowerCase().includes('échographie')) {
      formattedContent.push({ type: 'examType', text: trimmedLine });
    } else if (trimmedLine.endsWith(' :') || trimmedLine.endsWith(':')) {
      currentSection = trimmedLine;
      formattedContent.push({ 
        type: trimmedLine.toLowerCase().includes('conclusion') ? 'conclusion' : 'section', 
        text: trimmedLine,
        section: currentSection
      });
    } else {
      formattedContent.push({ 
        type: 'content',
        text: trimmedLine,
        section: currentSection
      });
    }
  });

  return formattedContent;
};

const addContent = (doc: jsPDF, content: string, startY: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - (margin * 2);
  let currentY = startY;
  
  const formattedContent = formatContent(content);
  
  formattedContent.forEach((line, index) => {
    switch (line.type) {
      case 'examType':
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(line.text, margin, currentY);
        doc.setLineWidth(0.5);
        const textWidth = doc.getTextWidth(line.text);
        doc.line(margin, currentY + 1, margin + textWidth, currentY + 1);
        currentY += 15;
        break;

      case 'section':
        if (index > 0) currentY += 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(line.text, margin, currentY);
        currentY += 8;
        break;

      case 'conclusion':
        if (index > 0) currentY += 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(line.text, margin, currentY);
        currentY += 8;
        break;
        
      case 'content':
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(line.text, maxWidth);
        doc.text(splitText, margin, currentY);
        currentY += splitText.length * 5;
        break;
        
      case 'empty':
        currentY += 3;
        break;
    }
  });
  
  return currentY + 20;
};

const addSignature = (doc: jsPDF, signature: string | null, startY: number): void => {
  if (!signature) return;

  try {
    const pageWidth = doc.internal.pageSize.getWidth();
    const signatureWidth = 50;
    const signatureHeight = 25;
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

export const generateEchoPDF = async (
  content: string,
  patientInfo: PatientInfo,
  doctorInfo: DoctorInfo
): Promise<jsPDF> => {
  try {
    const doc = new jsPDF();
    
    let currentY = await addLogo(doc);
    currentY = addHeader(doc, doctorInfo, patientInfo, currentY);
    currentY = addTitle(doc, currentY);
    currentY = addContent(doc, content, currentY);
    addSignature(doc, doctorInfo.signature, currentY);
    addFooter(doc);
    
    return doc;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw new Error('Impossible de générer le PDF. Veuillez réessayer.');
  }
};