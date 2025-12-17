import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Card,
  Heading,
  Text,
  Button,
  Separator,
} from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";

type User = "Tejas" | "Nikita";

/* ===================== HELPERS ===================== */
const getActiveUser = (): User =>
  (localStorage.getItem("activeUser") as User) || "Tejas";

/* ===================== TYPES ===================== */
type Meal = {
  user: User;
  calories: number;
  date: string;
};

type WalletEntry = {
  user: User;
  amount: number;
  type: "CREDIT" | "DEBIT";
  balanceAfter: number;
};

type ExpenseEntry = {
  paidBy: User;
  otherPerson: User;
  amount: number;
  type: "EXPENSE" | "LOAN";
  settled: boolean;
};

/* ===================== COMPONENT ===================== */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = getActiveUser();

  const theme =
    user === "Tejas"
      ? { main: "#4A90E2", soft: "#e0f2fe" }
      : { main: "#ec4899", soft: "#fce7f3" };

  /* ===================== DATA ===================== */
  const meals: Meal[] = JSON.parse(localStorage.getItem("meals") || "[]");
  const wallet: WalletEntry[] = JSON.parse(
    localStorage.getItem("wallet_entries_v1") || "[]"
  );
  const expenses: ExpenseEntry[] = JSON.parse(
    localStorage.getItem("simple_entries_v1") || "[]"
  );

  /* ===================== CALCULATIONS ===================== */
  const today = new Date().toLocaleDateString("en-CA");

  const todayCalories = meals
    .filter((m) => m.user === user && m.date === today)
    .reduce((s, m) => s + m.calories, 0);

  const walletBalance = wallet
    .filter((w) => w.user === user)
    .slice(-1)[0]?.balanceAfter || 0;

  const pendingLoans = expenses
    .filter(
      (e) =>
        e.type === "LOAN" &&
        !e.settled &&
        e.otherPerson === user
    )
    .reduce((s, e) => s + e.amount, 0);

  const totalSharedExpenses = expenses
    .filter((e) => e.type === "EXPENSE")
    .reduce((s, e) => s + e.amount / 2, 0);

  return (
    <Box
      style={{
        minHeight: "100vh",
        padding: "22px 16px",
        background: `linear-gradient(120deg,${theme.soft},#ffffff)`,
      }}
    >
      <Box style={{ maxWidth: 850, margin: "0 auto" }}>
        {/* HEADER */}
        <Flex align="center" gap="10px" mb="28px">
          <Button
            variant="soft"
            onClick={() => navigate("/")}
            style={{ borderRadius: 999 }}
          >
            <ArrowLeft />
          </Button>
          <Heading size="5">Dashboard — {user}</Heading>
        </Flex>

        {/* SUMMARY CARDS */}
        <Flex gap="16px" wrap="wrap">
          <Card style={{ flex: 1, minWidth: 240, padding: 20, borderRadius: 18 }}>
            <Heading size="3">🔥 Today Calories</Heading>
            <Text size="6" weight="bold">
              {todayCalories} kcal
            </Text>
          </Card>

          <Card style={{ flex: 1, minWidth: 240, padding: 20, borderRadius: 18 }}>
            <Heading size="3">💰 Wallet Balance</Heading>
            <Text size="6" weight="bold">
              ₹ {walletBalance.toFixed(2)}
            </Text>
          </Card>

          <Card style={{ flex: 1, minWidth: 240, padding: 20, borderRadius: 18 }}>
            <Heading size="3">🧾 Pending Loans</Heading>
            <Text size="6" weight="bold">
              ₹ {pendingLoans.toFixed(2)}
            </Text>
          </Card>
        </Flex>

        <Separator my="5" />

        {/* DETAILS */}
        <Flex gap="16px" wrap="wrap">
          <Card style={{ flex: 1, padding: 20, borderRadius: 18 }}>
            <Heading size="4" mb="2">
              Shared Expenses
            </Heading>
            <Text color="gray">
              Your total share in expenses
            </Text>
            <Text size="5" weight="bold" mt="2">
              ₹ {totalSharedExpenses.toFixed(2)}
            </Text>
          </Card>

          <Card style={{ flex: 1, padding: 20, borderRadius: 18 }}>
            <Heading size="4" mb="2">
              Active Profile
            </Heading>
            <Text color="gray">
              All data shown is for:
            </Text>
            <Text size="5" weight="bold" mt="2">
              {user}
            </Text>
          </Card>
        </Flex>
      </Box>
    </Box>
  );
};

export default Dashboard;
