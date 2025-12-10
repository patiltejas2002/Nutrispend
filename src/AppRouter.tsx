import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeScreen from "./Screens/HomeScreen";
import CaloriesScreen from "./Components/CaloriesScreen/CaloriesScreen";
import AddMeal from "./Components/CaloriesScreen/AddMeal";
import ExpensesScreen from "./Components/ExpensesScreen/ExpensesScreen";
import AddExpense from "./Components/ExpensesScreen/AddExpense";
import ExpensesSummary from "./Components/ExpensesScreen/ExpensesSummary";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomeScreen />} />

        {/* Calories */}
        <Route path="/calories" element={<CaloriesScreen />} />
        <Route path="/add-meal" element={<AddMeal />} />

        {/* Expenses */}
        <Route path="/expenses" element={<ExpensesScreen />} />
        <Route path="/expenses/add" element={<AddExpense />} />
        <Route path="/expenses/summary" element={<ExpensesSummary />} />

        {/* Unknown routes fallback */}
        <Route path="*" element={<HomeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
