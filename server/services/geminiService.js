


const { GoogleGenerativeAI } = require("@google/generative-ai");
let genAI = null;

try {
  if (
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== ""
  ) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("✅ Gemini AI Connected");
  } else {
    console.log("⚠️ Gemini API Key not found. Running in Offline Mode.");
  }
} catch (error) {
  console.error("Gemini Error:");
console.error(error);
console.error(error.message);

if (error.response) {
    console.log(error.response);
}}

// Helper to check if AI is available
const isAIAvailable = () => {
  return genAI !== null;
};

// Fallback high-quality mock generators
const mockSummaryGenerator = (title, skills) => {
  const skillsList = skills ? skills.split(',').map(s => s.trim()) : ['React', 'Node.js', 'MERN'];
  const formattedSkills = skillsList.slice(0, 4).join(', ');
  return `Results-driven and highly motivated ${title || 'Software Engineer'} with over 4 years of experience specializing in ${formattedSkills}. Proven track record of developing scalable web applications, optimizing database queries, and leading cross-functional teams. Passionate about leveraging cutting-edge technology to build elegant, high-performance solutions that drive business growth.`;
};

const mockSkillsGenerator = (title) => {
  const defaultSkills = {
    developer: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript (ES6+)', 'TypeScript', 'Tailwind CSS', 'Redux', 'RESTful APIs', 'Git/GitHub', 'Docker', 'AWS'],
    designer: ['UI/UX Design', 'Figma', 'Adobe XD', 'Adobe Creative Suite', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems', 'Typography', 'Responsive Design', 'Webflow'],
    manager: ['Project Management', 'Agile/Scrum', 'Team Leadership', 'Strategic Planning', 'Risk Management', 'Stakeholder Communication', 'Jira', 'Budgeting', 'Product Roadmap', 'KPI Tracking'],
    default: ['Communication', 'Problem Solving', 'Teamwork', 'Critical Thinking', 'Adaptability', 'Time Management', 'Leadership', 'Project Management'],
  };

  const loweredTitle = (title || '').toLowerCase();
  if (loweredTitle.includes('dev') || loweredTitle.includes('engineer') || loweredTitle.includes('programmer') || loweredTitle.includes('web')) {
    return defaultSkills.developer;
  } else if (loweredTitle.includes('design') || loweredTitle.includes('ux') || loweredTitle.includes('ui') || loweredTitle.includes('creative')) {
    return defaultSkills.designer;
  } else if (loweredTitle.includes('manager') || loweredTitle.includes('lead') || loweredTitle.includes('product') || loweredTitle.includes('project')) {
    return defaultSkills.manager;
  }
  return defaultSkills.default;
};

const mockProjectDescriptionGenerator = (projectTitle, technologies) => {
  const tech = technologies || 'modern web technologies';
  return [
    `Designed and architected a full-featured ${projectTitle || 'web application'} using ${tech}, improving user engagement by 35% within the first two months.`,
    `Integrated secure user authentication and payment processing, resolving critical security vulnerabilities and streamlining the checkout funnel.`,
    `Optimized server response times by 40% and database queries through indexing and query structure refinement, supporting an increased concurrent user load.`
  ];
};

const mockCoverLetterGenerator = (name, title, company, jd, skills) => {
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${title || 'Software Engineer'} position at ${company || 'your esteemed company'}. With a robust background in building responsive web systems and optimizing modern software architectures, I am confident in my ability to deliver significant value to your engineering team.

In my previous roles, I have successfully designed, built, and launched scalable applications using ${skills || 'React.js, Node.js, and MongoDB'}. Your focus on developing high-quality user experiences matches my technical expertise and design philosophy. I am particularly excited about the chance to apply my skills to solve complex problems and contribute to the innovative culture at ${company || 'your company'}.

Thank you for your time and consideration. I look forward to the opportunity to discuss how my experience and passion align with your needs.

Sincerely,
${name || 'Applicant'}`;
};

const mockATSChecker = (resumeText, jobDescription) => {
  const wordsInJD = (jobDescription || '').toLowerCase().match(/\b\w+\b/g) || [];
  const wordsInResume = (resumeText || '').toLowerCase().match(/\b\w+\b/g) || [];
  
  // Find matching words of length > 4 (simple keyword match heuristic)
  const jdKeywords = Array.from(new Set(wordsInJD.filter(w => w.length > 4)));
  const resumeKeywords = new Set(wordsInResume.filter(w => w.length > 4));
  
  const matching = jdKeywords.filter(w => resumeKeywords.has(w));
  const missing = jdKeywords.filter(w => !resumeKeywords.has(w)).slice(0, 8);
  
  const score = Math.min(100, Math.max(35, Math.round((matching.length / (jdKeywords.length || 1)) * 100) + 20));
  
  return {
    score: score,
    keywordMatch: {
      score: Math.min(100, Math.round(score * 0.95)),
      matchingKeywords: matching.slice(0, 10).map(w => w.charAt(0).toUpperCase() + w.slice(1)),
      missingKeywords: missing.map(w => w.charAt(0).toUpperCase() + w.slice(1)),
    },
    formatting: {
      score: 85,
      feedback: [
        'Resume layout is clear and structured in standard chronological format.',
        'Use of standard font families ensures parser readability.',
        'Ensure contact information is in the header section.',
        'Avoid images, graphics or sidebars in complex templates as they might confuse older ATS systems.'
      ],
    },
    missingSkills: missing.slice(0, 5).map(w => w.charAt(0).toUpperCase() + w.slice(1)),
    suggestions: [
      'Incorporate missing keywords naturally into your Professional Summary or Skills section.',
      'Quantify your accomplishments in your Experience description using percentages and numbers (e.g. Improved performance by 30%).',
      'Add a dedicated Projects section highlighting technologies used.',
      'Verify that dates are formatted consistently throughout your experience section.'
    ],
  };
};

// AI generation functions calling Gemini or falling back to mocks
const generateSummary = async ({ title, skills }) => {
  if (!isAIAvailable()) {
    return mockSummaryGenerator(title, skills);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Write a professional, compelling, and ATS-friendly resume summary (about 3-4 sentences) for a ${title} who has skills in: ${skills}. Make it highly professional and engaging. Return ONLY the plain text summary, no surrounding markdown, no quotes, and no conversational intro.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini generateSummary error, falling back to mock:', error);
    return mockSummaryGenerator(title, skills);
  }
};

const generateSkills = async ({ title }) => {
  if (!isAIAvailable()) {
    return mockSkillsGenerator(title);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Provide a list of 10-12 highly relevant skills for a resume of a ${title}. Return them as a JSON array of strings only. Format: ["Skill 1", "Skill 2", ...]. Ensure it is a valid JSON array and contains nothing else.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    // Parse JSON safely
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini generateSkills error, falling back to mock:', error);
    return mockSkillsGenerator(title);
  }
};

const generateProjectDescription = async ({ title, technologies }) => {
  if (!isAIAvailable()) {
    return mockProjectDescriptionGenerator(title, technologies);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Generate 3 strong, results-oriented, and ATS-friendly resume bullet points describing a project titled "${title}" built with technologies: "${technologies}". Start each bullet point with an impact action verb. Return them as a JSON array of strings only. Format: ["Bullet 1", "Bullet 2", "Bullet 3"]. Ensure it is a valid JSON array and contains nothing else.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini generateProjectDescription error, falling back to mock:', error);
    return mockProjectDescriptionGenerator(title, technologies);
  }
};

const generateCoverLetter = async ({ name, title, company, jobDescription, skills }) => {
  if (!isAIAvailable()) {
    return mockCoverLetterGenerator(name, title, company, jobDescription, skills);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Write a professional cover letter from ${name} applying for the position of "${title}" at "${company}". The job description is: "${jobDescription}". The applicant's skills include: "${skills}". Format it beautifully. Return only the cover letter body text, no extra conversational introduction from the AI.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini generateCoverLetter error, falling back to mock:', error);
    return mockCoverLetterGenerator(name, title, company, jobDescription, skills);
  }
};

const checkATS = async (resumeText, jobDescription) => {
  if (!isAIAvailable()) {
    return mockATSChecker(resumeText, jobDescription);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a professional ATS (Applicant Tracking System) reviewer and hiring manager.
Compare the resume text and job description provided below and evaluate it.

Resume Content:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Provide your analysis in EXACT JSON format with the following structure:
{
  "score": (number between 0 and 100 representing overall match rate),
  "keywordMatch": {
    "score": (number between 0 and 100),
    "matchingKeywords": ["KeywordA", "KeywordB", ...],
    "missingKeywords": ["KeywordC", "KeywordD", ...]
  },
  "formatting": {
    "score": (number between 0 and 100),
    "feedback": ["Feedback 1", "Feedback 2", ...]
  },
  "missingSkills": ["Skill A", "Skill B", ...],
  "suggestions": ["Suggestion 1", "Suggestion 2", ...]
}
Return ONLY valid JSON content. Do not include markdown code block formatting like \`\`\`json.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    // Parse JSON
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini checkATS error, falling back to mock:', error);
    return mockATSChecker(resumeText, jobDescription);
  }
};

module.exports = {
  generateSummary,
  generateSkills,
  generateProjectDescription,
  generateCoverLetter,
  checkATS,
  isAIAvailable,
};
