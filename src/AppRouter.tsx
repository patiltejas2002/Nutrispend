import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeScreen from "./Screens/HomeScreen";
import CaloriesScreen from "./Components/CaloriesScreen/CaloriesScreen";
import AddMeal from "./Components/CaloriesScreen/AddMeal";
import ExpensesScreen from "./Components/ExpensesScreen/ExpensesScreen";
import AddExpense from "./Components/ExpensesScreen/AddExpense";
import ExpensesSummary from "./Components/ExpensesScreen/ExpensesSummary";
import WalletExpense from "./Components/ExpensesScreen/WalletExpense"; // ✅ NEW
import DashboardScreen from "./Screens/DashboardScreen";
import DrinkLog from "./Components/DrinkLog/DrinkLog";
import DrinkSummary from "./Components/DrinkLog/DrinkSummary";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />

        {/* Wallet Expense (NEW FLOW) */}
        <Route path="/wallet" element={<WalletExpense />} />

        {/* Calories */}
        <Route path="/calories" element={<CaloriesScreen />} />
        <Route path="/add-meal" element={<AddMeal />} />
        <Route path="/drinks" element={<DrinkLog />} />
        <Route path="/drinks/summary" element={<DrinkSummary />} />


        {/* Old Expenses (keep as-is) */}
        <Route path="/expenses" element={<ExpensesScreen />} />
        <Route path="/expenses/add" element={<AddExpense />} />
        <Route path="/expenses/summary" element={<ExpensesSummary />} />

        {/* Fallback */}
        <Route path="*" element={<HomeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
