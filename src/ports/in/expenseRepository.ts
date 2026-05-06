export type ExpenseID = string;
export interface ExpenseRepository {
  create(userID: string, Expense: Expense): ExpenseID;
  findMany(start: Date, end: Date, orderBy: string): Expense;
}
