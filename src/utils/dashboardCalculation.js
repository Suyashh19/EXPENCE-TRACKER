export const getDaysInMonth = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

export const getDaysLeftInMonth = () => {
  const today = new Date();
  return getDaysInMonth(today) - today.getDate();
};

export const getAveragePastMonths = (expenses, months = 3) => {
  const now = new Date();
  let totals = [];

  for (let i = 1; i <= months; i++) {
    // Go back i months from now
    const targetDate = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    const total = expenses
      .filter(e => {
        if (!e.date) return false;
        const d = new Date(e.date);
        return (
          d.getMonth() === targetMonth &&
          d.getFullYear() === targetYear
        );
      })
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    totals.push(total);
  }

  // Average ONLY over those past months
  return totals.length
    ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length)
    : 0;
};


export const getMonthlyHealth = (spent, budget) => {
  if (!budget) return { label: "Unknown", color: "gray" };

  const percent = (spent / budget) * 100;

  if (percent < 60) return { label: "Good", color: "green" };
  if (percent < 85) return { label: "Okay", color: "yellow" };
  return { label: "Risky", color: "red" };
};

export const getExpenseVelocity = (spent, budget, day) => {
  console.log(day)
  const idealPerDay = budget / getDaysInMonth();
  console.log(getDaysInMonth())
  const actualPerDay = spent / day;
  return actualPerDay / idealPerDay;
};

export const getSafeToSpendToday = (spent, budget) => {
  const daysLeft = getDaysLeftInMonth();
  if (daysLeft <= 0) return 0;
  return Math.max(Math.floor((budget - spent) / daysLeft), 0);
};
