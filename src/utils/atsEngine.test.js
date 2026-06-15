import { analyzeMatch } from './atsEngine';

// ── analyzeMatch ────────────────────────────────────────────────────────────

describe('analyzeMatch', () => {
  test('returns null when job description is empty', () => {
    expect(analyzeMatch('', 'some resume text')).toBeNull();
  });

  test('returns null when resume text is empty', () => {
    expect(analyzeMatch('looking for a python developer', '')).toBeNull();
  });

  test('returns null when both inputs are empty', () => {
    expect(analyzeMatch('', '')).toBeNull();
  });

  test('returns a result object with required fields', () => {
    const result = analyzeMatch('Python developer with React experience', 'Python React developer');
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('totalKeywords');
    expect(result).toHaveProperty('matchedKeywords');
    expect(result).toHaveProperty('missingKeywords');
    expect(result).toHaveProperty('categoryScores');
    expect(result).toHaveProperty('byCategory');
  });

  test('score is a number between 0 and 100', () => {
    const result = analyzeMatch('Python React AWS developer', 'Python React AWS');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test('perfect match returns high score', () => {
    const jd = 'Looking for a Python developer with React and AWS experience';
    const resume = 'Python developer with React and AWS experience. Strong Python and React skills.';
    const result = analyzeMatch(jd, resume);
    expect(result.score).toBeGreaterThan(50);
  });

  test('zero match returns low score', () => {
    const jd = 'Python React AWS Kubernetes Docker TypeScript';
    const resume = 'Experienced chef with culinary arts background and restaurant management';
    const result = analyzeMatch(jd, resume);
    expect(result.score).toBeLessThan(50);
  });

  test('matched keywords are found in the resume', () => {
    const jd = 'Python developer with SQL experience';
    const resume = 'Experienced Python engineer with strong SQL and database skills';
    const result = analyzeMatch(jd, resume);
    result.matchedKeywords.forEach((kw) => {
      expect(resume.toLowerCase()).toContain(kw.keyword.toLowerCase());
    });
  });

  test('missing keywords are NOT found in the resume', () => {
    const jd = 'Python React AWS Kubernetes developer';
    const resume = 'Python developer with SQL experience only';
    const result = analyzeMatch(jd, resume);
    result.missingKeywords.forEach((kw) => {
      expect(resume.toLowerCase()).not.toContain(kw.keyword.toLowerCase());
    });
  });

  test('matchedKeywords + missingKeywords equals totalKeywords', () => {
    const jd = 'Python React Node.js AWS Docker developer with leadership skills';
    const resume = 'Python and Node.js developer with some AWS experience';
    const result = analyzeMatch(jd, resume);
    expect(result.matchedKeywords.length + result.missingKeywords.length).toBe(result.totalKeywords);
  });

  test('byCategory contains all four categories', () => {
    const result = analyzeMatch('Python developer with leadership and bachelor degree', 'Python engineer');
    expect(result.byCategory).toHaveProperty('hardSkills');
    expect(result.byCategory).toHaveProperty('softSkills');
    expect(result.byCategory).toHaveProperty('experience');
    expect(result.byCategory).toHaveProperty('education');
  });

  test('technical keywords are classified as hardSkills', () => {
    const result = analyzeMatch('Python React AWS developer', 'some text');
    const hardSkillKeywords = result.byCategory.hardSkills.map((k) => k.keyword);
    expect(hardSkillKeywords.some((k) => ['python', 'react', 'aws'].includes(k))).toBe(true);
  });

  test('handles whitespace-only inputs as empty', () => {
    expect(analyzeMatch('   ', 'resume text')).toBeNull();
    expect(analyzeMatch('job description', '   ')).toBeNull();
  });

  test('score is 100 at most even for identical texts', () => {
    const text = 'Python React AWS Docker Kubernetes TypeScript Node.js leadership teamwork';
    const result = analyzeMatch(text, text);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test('categoryScores weight fields are present', () => {
    const result = analyzeMatch('Python developer with leadership', 'Python engineer');
    Object.values(result.categoryScores).forEach((cat) => {
      expect(cat).toHaveProperty('weight');
      expect(cat).toHaveProperty('score');
    });
  });
});
