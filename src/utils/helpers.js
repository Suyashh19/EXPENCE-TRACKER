/* ============================
   DATE HELPERS
============================ */

// Normalize date string to Date object
// Supports: YYYY-MM-DD and DD-MM-YYYY
export const parseExpenseDate = (dateStr) => {
  if (!dateStr) return null;

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr);
  }

  // DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [dd, mm, yyyy] = dateStr.split("-");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  return null;
};

export const getTodayDateString = () => {
  return new Date().toISOString().split("T")[0];
};

export const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return { start, end };
};

/* ============================
   EXPENSE CALCULATIONS
============================ */

export const getTodayTotal = (expenses = []) => {
  const today = getTodayDateString();

  return expenses.reduce((sum, exp) => {
    const expDate = parseExpenseDate(exp.date);
    if (!expDate) return sum;

    const expISO = expDate.toISOString().split("T")[0];
    return expISO === today ? sum + Number(exp.amount) : sum;
  }, 0);
};

export const getCurrentMonthTotal = (expenses = []) => {
  const { start, end } = getCurrentMonthRange();

  return expenses.reduce((sum, exp) => {
    const expDate = parseExpenseDate(exp.date);
    if (!expDate) return sum;

    return expDate >= start && expDate <= end
      ? sum + Number(exp.amount)
      : sum;
  }, 0);
};

/* ============================
   BUDGET
============================ */

export const getBudgetUsagePercent = (spent, budget) => {
  if (!budget || budget <= 0) return 0;
  return Math.round((spent / budget) * 100);
};

/* ============================
   🔥 NEW (DO NOT REMOVE)
   MONTHLY BUDGET WARNING
============================ */

export const shouldWarnMonthlyBudget = (spent, budget) => {
  if (!budget || budget <= 0) return false;
  return spent / budget >= 0.8;
};
