// Common English stopwords to filter out of keyword extraction
const STOPWORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by','from','up',
  'about','into','through','during','before','after','above','below','between','out','off',
  'is','are','was','were','be','been','being','have','has','had','do','does','did','will',
  'would','could','should','may','might','shall','can','need','dare','ought',
  'i','me','my','we','our','you','your','he','him','his','she','her','they','them','their',
  'it','its','this','that','these','those','which','who','whom','what','when','where','why','how',
  'all','both','each','few','more','most','other','some','such','no','not','only','same','so',
  'than','too','very','just','as','if','while','although','because','since','unless','until',
  'also','well','even','still','back','only','here','there','then','any','own','over','under',
  'again','further','once','any','both','each','etc','ie','eg','per','via',
  'must','new','use','used','using','years','year','team','work','experience','ability',
  'strong','good','excellent','required','preferred','including','including','including',
]);

// Extract meaningful multi-word phrases + single keywords from text
function extractKeywords(text) {
  if (!text) return [];
  const lower = text.toLowerCase();

  // Common tech/skill bigrams and trigrams to preserve
  const phrases = [];
  const phrasePatterns = [
    /\b(machine learning|deep learning|natural language processing|computer vision)\b/g,
    /\b(ci\/cd|continuous integration|continuous deployment|continuous delivery)\b/g,
    /\b(rest api|restful api|graphql api)\b/g,
    /\b(agile methodology|agile scrum|project management|product management)\b/g,
    /\b(cloud computing|cloud infrastructure|cloud native)\b/g,
    /\b(data analysis|data science|data engineering|data pipelines)\b/g,
    /\b(version control|source control)\b/g,
    /\b(object.oriented|functional programming|system design)\b/g,
    /\b(unit test|integration test|test.driven|behavior.driven)\b/g,
    /\b(cross.functional|cross functional)\b/g,
    /\b(full.?stack|front.?end|back.?end)\b/g,
    /\b(sql server|mysql|postgresql|mongodb|nosql|dynamodb|firebase)\b/g,
    /\b(node\.?js|react\.?js|vue\.?js|angular|next\.?js|nuxt\.?js)\b/g,
    /\b(aws|azure|google cloud|gcp|kubernetes|docker|terraform)\b/g,
    /\b(typescript|javascript|python|java|golang|rust|ruby|swift|kotlin|scala)\b/g,
    /\b(communication skills?|leadership skills?|problem.solving|critical thinking)\b/g,
    /\b(bachelor'?s?|master'?s?|phd|mba|b\.?s\.?|m\.?s\.?)\b/g,
    /\b(power bi|tableau|looker|qlik|data.?bricks)\b/g,
    /\b(spring boot|django|flask|fastapi|express\.?js|laravel)\b/g,
    /\b(ci cd|devops|devsecops|gitops|mlops)\b/g,
    /\b(redis|kafka|rabbitmq|elasticsearch|solr|cassandra)\b/g,
    /\b(html5?|css3?|sass|scss|tailwind|bootstrap)\b/g,
  ];

  phrasePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(lower)) !== null) {
      phrases.push(match[0].replace(/\s+/g, ' ').trim());
    }
  });

  // Single meaningful tokens
  const tokens = lower
    .replace(/[^a-z0-9#+.\-/\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 3 && !STOPWORDS.has(t) && !/^\d+$/.test(t));

  // Combine, deduplicate, keep phrases first
  const all = [...new Set([...phrases, ...tokens])];
  return all;
}

// Weight categories for scoring
const CATEGORY_WEIGHTS = {
  hardSkills: 0.40,   // technical/tools keywords
  softSkills: 0.20,   // soft skills, traits
  experience: 0.25,   // role titles, responsibilities
  education:  0.15,   // degree, field keywords
};

function categorize(kw) {
  const techPattern = /\b(python|java|javascript|typescript|react|angular|vue|node|aws|azure|gcp|docker|kubernetes|sql|mongodb|redis|kafka|graphql|rest|api|git|linux|terraform|ci|cd|devops|machine learning|deep learning|nlp|tensorflow|pytorch|spark|hadoop|airflow|tableau|power bi|excel|css|html|swift|kotlin|ruby|go|rust|c\+\+|c#|\.net|php|laravel|django|flask|spring|fastapi|express|bootstrap|tailwind|figma|jira|confluence)\b/i;
  const softPattern = /\b(communication|leadership|teamwork|collaboration|problem.solving|critical thinking|creative|analytical|detail|organized|self.motivated|adaptable|initiative|mentoring|coaching|cross.functional)\b/i;
  const eduPattern = /\b(bachelor|master|phd|mba|degree|university|college|certification|certified|diploma|graduate|undergraduate|gpa|b\.s|m\.s|b\.e|m\.e)\b/i;

  if (techPattern.test(kw)) return 'hardSkills';
  if (softPattern.test(kw)) return 'softSkills';
  if (eduPattern.test(kw)) return 'education';
  return 'experience';
}

export function analyzeMatch(jobDescription, resumeText) {
  if (!jobDescription.trim() || !resumeText.trim()) return null;

  const jdKeywords = extractKeywords(jobDescription);
  const resumeLower = resumeText.toLowerCase();

  // For each JD keyword, check if it appears in the resume
  const results = jdKeywords.map(kw => {
    const found = resumeLower.includes(kw.toLowerCase());
    const category = categorize(kw);
    return { keyword: kw, found, category };
  });

  // Deduplicate by keyword text
  const seen = new Set();
  const unique = results.filter(r => {
    if (seen.has(r.keyword)) return false;
    seen.add(r.keyword);
    return true;
  });

  // Group by category
  const byCategory = {
    hardSkills: unique.filter(r => r.category === 'hardSkills'),
    softSkills: unique.filter(r => r.category === 'softSkills'),
    experience: unique.filter(r => r.category === 'experience'),
    education:  unique.filter(r => r.category === 'education'),
  };

  // Score per category (% matched, weighted)
  let totalScore = 0;
  const categoryScores = {};

  Object.entries(byCategory).forEach(([cat, items]) => {
    if (items.length === 0) {
      categoryScores[cat] = { matched: 0, total: 0, score: 100, weight: CATEGORY_WEIGHTS[cat] };
      return;
    }
    const matched = items.filter(r => r.found).length;
    const pct = (matched / items.length) * 100;
    categoryScores[cat] = { matched, total: items.length, score: Math.round(pct), weight: CATEGORY_WEIGHTS[cat] };
    totalScore += pct * CATEGORY_WEIGHTS[cat];
  });

  const matchedAll = unique.filter(r => r.found);
  const missingAll = unique.filter(r => !r.found);

  // Sort missing by category priority
  const categoryPriority = { hardSkills: 0, experience: 1, softSkills: 2, education: 3 };
  missingAll.sort((a, b) => categoryPriority[a.category] - categoryPriority[b.category]);

  return {
    score: Math.min(100, Math.round(totalScore)),
    totalKeywords: unique.length,
    matchedKeywords: matchedAll,
    missingKeywords: missingAll,
    categoryScores,
    byCategory,
  };
}

// Extract text from PDF using pdfjs-dist
export async function extractTextFromPDF(file) {
  const pdfjsLib = await import('pdfjs-dist');
  // Use the legacy build for CRA compatibility
  pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}
