import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass
  }
});

export const sendPrescriptionEmail = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    // Vérifier l'authentification
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'L\'utilisateur doit être authentifié'
      );
    }

    const { email, pdfUrl, patientName } = data;

    try {
      await transporter.sendMail({
        from: '"SOS Médecins Bordeaux" <no-reply@sosmedecins-bordeaux.com>',
        to: email,
        subject: 'Votre ordonnance SOS Médecins',
        text: `Bonjour,\n\nVeuillez trouver ci-joint votre ordonnance.\n\nCordialement,\nSOS Médecins Bordeaux`,
        html: `
          <p>Bonjour,</p>
          <p>Veuillez trouver ci-joint votre ordonnance.</p>
          <p>Cordialement,<br>SOS Médecins Bordeaux</p>
        `,
        attachments: [
          {
            filename: `ordonnance_${patientName}.pdf`,
            path: pdfUrl
          }
        ]
      });

      return { success: true };
    } catch (error) {
      throw new functions.https.HttpsError('internal', 'Erreur lors de l\'envoi de l\'email');
    }
  });