// Regex plus précise pour les numéros de téléphone français
export const phoneRegex = /(?:(?:\+|00)?33|0)\s*[1-9](?:[\s.-]*\d{2}){4}(?!\d)/;

export function formatPhoneNumber(phone: string): string {
  // Nettoie le numéro de tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Normalise le numéro au format français
  let normalizedNumber = cleaned;
  
  if (cleaned.startsWith('00')) {
    normalizedNumber = cleaned.slice(2, 12);
  } else if (cleaned.startsWith('33')) {
    normalizedNumber = cleaned.slice(2, 12);
  } else if (cleaned.startsWith('0')) {
    normalizedNumber = cleaned.slice(1, 11);
  }
  
  // Format final : +33 suivi des 9 chiffres
  return '+33' + normalizedNumber;
}

export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  
  // Vérifie le format français standard (10 chiffres)
  if (cleaned.startsWith('33') || cleaned.startsWith('0')) {
    const withoutPrefix = cleaned.startsWith('33') ? cleaned.slice(2) : cleaned.slice(1);
    return /^[1-9]\d{8}$/.test(withoutPrefix);
  }
  
  return false;
}