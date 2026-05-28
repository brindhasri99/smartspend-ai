export const money = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Salary",
  "Subscriptions",
  "Education",
  "Other"
];
