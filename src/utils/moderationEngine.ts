export type ModerationAction = 'PUBLISH' | 'PENDING' | 'REJECT';

export interface ModerationResult {
  totalScore: number;
  flaggedWords: string[];
  recommendedAction: ModerationAction;
  reason?: string;
}

// 1. Keyword Dictionary
const HIGH_RISK_KEYWORDS = [
  'judol', 'judi', 'slot', 'slot88', 'maxwin', 'porno', 'bokep', 'lendir', 
  'bo', 'togel', 'situs judi', 'sbobet', 'kasino', 'casino'
];

const MEDIUM_RISK_KEYWORDS = [
  'gacor', 'depo', 'deposit', 'wd', 'withdraw', 'jp', 'jackpot', 'rtp',
  'pasti menang', 'anti rungkad', 'pola', 'scatter', 'angka main', 
  'anjing', 'bangsat', 'kontol', 'memek', 'ngentot' // Profanity is medium risk because it might be a false positive or just bad words, not strictly illegal
];

// 2. Phrase Dictionary
const HIGH_RISK_PHRASES = [
  'garansi kekalahan', 'pasti wd', 'link di bio', 'modal receh', 
  'auto sultan', 'bandar terpercaya', 'gampang menang', 'slot pulsa'
];

/**
 * Calculates the risk score of an ad based on its content.
 * Action Thresholds:
 * - > 80: REJECT (Highly likely to be illegal/spam/nsfw)
 * - > 30: PENDING (Needs admin review)
 * - <= 30: PUBLISH (Safe)
 */
export const evaluateAdContent = (
  title: string,
  description: string,
  category: string
): ModerationResult => {
  let totalScore = 0;
  const flaggedWords: string[] = [];

  const textToAnalyze = `${title} ${description}`.toLowerCase();

  // Check High Risk Keywords (+80 each)
  HIGH_RISK_KEYWORDS.forEach((keyword) => {
    // Use word boundaries for strict matching where possible, but for Indonesian slang, simple includes is often safer to catch variations.
    if (textToAnalyze.includes(keyword)) {
      totalScore += 80;
      flaggedWords.push(keyword);
    }
  });

  // Check Medium Risk Keywords (+30 each)
  MEDIUM_RISK_KEYWORDS.forEach((keyword) => {
    if (textToAnalyze.includes(keyword)) {
      totalScore += 30;
      flaggedWords.push(keyword);
    }
  });

  // Check High Risk Phrases (+80 each)
  HIGH_RISK_PHRASES.forEach((phrase) => {
    if (textToAnalyze.includes(phrase)) {
      totalScore += 80;
      flaggedWords.push(phrase);
    }
  });

  // 3. Contextual Anomalies (+50)
  const isSuspiciousCategory = ['lowongan', 'jasa', 'pendidikan', 'rumah-tangga'].includes(category.toLowerCase());
  const hasGamblingVibe = 
    textToAnalyze.includes('depo') || 
    textToAnalyze.includes('gacor') || 
    textToAnalyze.includes('wd') || 
    textToAnalyze.includes('cuan');

  if (isSuspiciousCategory && hasGamblingVibe) {
    totalScore += 50;
    flaggedWords.push('Contextual Anomaly: Gambling terms in inappropriate category');
  }

  // Determine Action
  let recommendedAction: ModerationAction = 'PUBLISH';
  let reason = '';

  if (totalScore > 80) {
    recommendedAction = 'REJECT';
    reason = 'Pelanggaran berat. Mengandung unsur yang dilarang keras (Judi, Pornografi, Spam).';
  } else if (totalScore > 30) {
    recommendedAction = 'PENDING';
    reason = 'Sistem mendeteksi kata-kata mencurigakan. Iklan perlu ditinjau manual oleh Admin.';
  }

  return {
    totalScore,
    flaggedWords: Array.from(new Set(flaggedWords)), // Remove duplicates
    recommendedAction,
    reason,
  };
};
