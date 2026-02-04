// src/utils/dateValidation.ts

const DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{4}$/;

// Check MM/YYYY format
export const isValidMonthYearFormat = (value: string): boolean =>
  DATE_REGEX.test(value);

// Convert MM/YYYY → Date (first day of month)
export const parseMonthYearToDate = (value: string): Date | null => {
  if (!isValidMonthYearFormat(value)) return null;

  const [month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, 1);
};

// Check date is NOT in the future
export const isPastOrCurrentMonth = (value: string): boolean => {
  const inputDate = parseMonthYearToDate(value);
  if (!inputDate) return false;

  const now = new Date();
  const currentMonthDate = new Date(now.getFullYear(), now.getMonth(), 1);

  return inputDate <= currentMonthDate;
};

// Final validator (use everywhere)
export const isValidIssueDate = (value: string): boolean =>
  isValidMonthYearFormat(value) && isPastOrCurrentMonth(value);
