import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const convertDateToISO = (dateStr) => {
  const [dd, mm, yyyy] = dateStr.split("-");
  return `${yyyy}-${mm}-${dd}`;
};


export const generateText = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error.message);
    throw new Error("Gemini generation failed");
  }
};


export const parseExpenseMessage = async (userMessage) => {
  const prompt = `
You are an API that converts natural language expense messages into JSON.

Return ONLY valid JSON.
No explanation. No markdown. No extra text.

CURRENT DATE (IST): ${new Date().toLocaleDateString("en-CA", {
  timeZone: "Asia/Kolkata"
})}

Rules:
- Choose "category" ONLY from:
  Food, Transport, Shopping, Bills, Entertainment, Others
- If category is unclear, use "Others"
- Amount must be a number
- Date must be in YYYY-MM-DD format
- If the user DOES NOT mention a date, use CURRENT DATE (IST)
- If the user mentions a date (yesterday, today, specific date), convert it correctly to YYYY-MM-DD (IST)
- Title must be a short meaningful summary of the expense

Schema:
{
  "title": string,
  "amount": number,
  "category": "Food | Transport | Shopping | Bills | Entertainment | Others",
  "date": "YYYY-MM-DD"
}

Message:
"${userMessage}"
`;


  const response = await generateText(prompt);

  console.log("Gemini raw response:", response);

  // Clean markdown if Gemini adds it
  const cleaned = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("JSON Parse Error:", cleaned);
    throw new Error("Could not parse expense");
  }
};


// export const expenseAdvisor = async (expenseSummary) => {
//   const prompt = `
// You are a personal finance advisor.

// Expense summary:
// ${JSON.stringify(expenseSummary, null, 2)}

// Provide:
// - Spending pattern analysis
// - 3 actionable tips
// - One warning if overspending
// `;

//   return generateText(prompt);
// };
export const expenseAdvisor = async (prompt) => {
  return generateText(prompt);
};


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

  const cleaned = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Invalid Dashboard JSON:", cleaned);
    throw new Error("Invalid dashboard JSON returned by Gemini");
  }
};
