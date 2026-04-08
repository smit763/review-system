const BANNED_WORDS = [
  "spam",
  "scam",
  "fake",
  "phishing",
  "malware",
  "virus",
  "hack",
  "crack",
  "porn",
  "adult",
  "casino",
  "gambling",
  "lottery",
  "win",
  "free",
  "money",
  "rich",
  "millionaire",
  "billionaire",
  "click",
  "buy now"
];

const SPAM_PATTERNS = [
  /\b(?:free|win|click here|buy now|limited time|urgent|act now)\b/gi,
  /\b(?:http|www\.|\.com|\.net|\.org)\b/gi,
  /\b\d{10,}\b/g
];

const riskCalculate = (text: string): number => {
  if (!text || typeof text !== "string") return 100;

  const totalWords = text.trim().split(/\s+/).length;

  const normalizedText = text.toLowerCase();
  const originalText = text;
  const bannedWordsFound = BANNED_WORDS.filter((word) =>
    normalizedText.includes(word)
  );

  let patternMatches = 0;
  SPAM_PATTERNS.forEach((pattern) => {
    const matches = originalText.match(pattern);
    if (matches) patternMatches += matches.length;
  });

  const letters = originalText.replace(/[^a-zA-Z]/g, "");
  let upperCaseCounts = 0;
  if (letters.length > 0) {
    const uppercaseCount = (originalText.match(/[A-Z]/g) || []).length;
    const uppercaseRatio = uppercaseCount / letters.length;
    if (uppercaseRatio > 0.5) {
      upperCaseCounts = Math.min((uppercaseRatio - 0.5) * 100, 25);
    }
  }

  const exclamationCount = (originalText.match(/!/g) || []).length;

  const repetitiveChars = /(.)\1{4,}/g.test(originalText) ? 5 : 0;
  const unWantedWords =
    repetitiveChars +
    exclamationCount +
    upperCaseCounts +
    Math.min(patternMatches * 3, 20) +
    bannedWordsFound.length;

  const wordDensity =
    unWantedWords > totalWords ? 100 : 100 * unWantedWords / totalWords;
  console.log(wordDensity, "wordDensity");

  return wordDensity;
};

export default riskCalculate;
