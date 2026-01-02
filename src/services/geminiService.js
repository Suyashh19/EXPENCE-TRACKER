import { GoogleGenerativeAI } from "@google/generative-ai";

// --------------------
// INIT GEMINI
// --------------------
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// --------------------
// UTILS
// --------------------
const cleanJSONResponse = (text) =>
  text.replace(/```json/g, "").replace(/```/g, "").trim();

// --------------------
// BASE TEXT GENERATOR
// --------------------


export const generateText = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Gemini generation failed");
  }
};


// --------------------
// 1️⃣ PARSE EXPENSE MESSAGE
// --------------------
export const parseExpenseMessage = async (userMessage) => {
  const currentDate = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const prompt = `
You are an API that converts natural language expense messages into JSON.

Return ONLY valid JSON.
No explanation. No markdown. No extra text.

CURRENT DATE (IST): ${currentDate}

Rules:
- Choose "category" ONLY from:
  Food, Transport, Shopping, Bills, Entertainment, Others
- Choose Payment Method from following methods:
  UPI, Card, Cash, Online, Other
- If category is unclear, use "Others"
- Amount must be a number
- Date must be in YYYY-MM-DD format
- If the user DOES NOT mention a date, use CURRENT DATE (IST)
- If the user mentions a date (yesterday, today, specific date), convert it correctly
- Title must be a short meaningful summary

Schema:
{
  "title": string,
  "amount": number,
  "category": "Food | Transport | Shopping | Bills | Entertainment | Others",
  "date": "YYYY-MM-DD",
  "paymentMethod":string
  ""
}

Message:
"${userMessage}"
`;

  const response = await generateText(prompt);
  const cleaned = cleanJSONResponse(response);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("JSON Parse Error:", error, cleaned);
    throw new Error("Could not parse expense");
  }
};

// --------------------
// 2️⃣ GENERIC AI ADVISOR
// --------------------
export const expenseAdvisor = async (prompt) => {
  return generateText(prompt);
};

// --------------------
// 3️⃣ DASHBOARD ANALYTICS (JSON)
// --------------------
export const generateExpenseDashboardJSON = async (expenseAnalytics) => {
  const prompt = `
You are an API that prepares expense analytics for a finance dashboard.

Return ONLY valid JSON.
No explanation. No markdown.

Use EXACTLY this structure:

{
  "kpis": {
    "averageMonthlySpend": number,
    "medianMonthlySpend": number,
    "highestCategory": string,
    "lowestCategory": string,
    "savingsPotential": number
  },
  "categoryBreakdown": {
    "Food": number,
    "Transport": number,
    "Shopping": number,
    "Bills": number,
    "Entertainment": number,
    "Others": number
  },
  "trends": {
    "overallTrend": "Increasing | Decreasing | Stable",
    "mostIncreasedCategory": string,
    "mostDecreasedCategory": string,
    "consistencyScore": number
  },
  "alerts": {
    "overspendingCategories": string[],
    "budgetRiskLevel": "Low | Medium | High",
    "spikeDetected": boolean
  },
  "recommendations": {
    "summary": string,
    "actionItems": string[]
  }
}

Input Data:
${JSON.stringify(expenseAnalytics, null, 2)}
`;

  const response = await generateText(prompt);
  const cleaned = cleanJSONResponse(response);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Invalid Dashboard JSON:", error, cleaned);
    throw new Error("Invalid dashboard JSON returned by Gemini");
  }
};
export const getAiInsight = async (context) => {
  try {
    const todayKey = `ai_insight_${new Date().toDateString()}`;
    const cached = localStorage.getItem(todayKey);

    if (cached) {
      return cached; // ✅ NO API CALL
    }

       const prompt = `
You are a personal finance assistant inside a money tracking app.

This is the user's current financial context:
${context}

Your task:
- Generate ONE short, helpful financial insight
- Maximum 2 sentences
- No emojis
- Is markdown
- No greetings
- No questions
- No generic advice

Rules:
- Base the insight strictly on the given data
- If spending looks healthy, reinforce good behavior
- If spending is risky, warn gently
- Mention payment methods only if patterns are meaningful
- Sound calm, practical, and intelligent

Output:
A single short insight sentence.
`;
    const response = await generateText(prompt);
    console.log(response)
    localStorage.setItem(todayKey, response);
    return response;
  } catch (err) {
    console.error("AI Insight error:", err);
    return "AI insight unavailable today.";
  }
};

