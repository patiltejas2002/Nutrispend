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
import {
  Wallet,
  Flame,
  HandCoins,
  UserCircle,
  ArrowLeft,
} from "lucide-react";

type User = "Tejas" | "Nikita";

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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = getActiveUser();

  const theme =
    user === "Tejas"
      ? {
          main: "#2563eb", // blue-600
          soft: "#cfe4ffff",
          card: "#ffffff",
        }
      : {
          main: "#db2777", // pink-600
          soft: "#fbdbedff",
          card: "#ffffff",
        };

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

  const walletBalance =
    wallet.filter((w) => w.user === user).slice(-1)[0]?.balanceAfter || 0;

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
        background: `linear-gradient(135deg,${theme.soft},#ffffff)`,
      }}
    >
      <Box style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* HEADER */}
        <Flex align="center" gap="12px" mb="22px">
          <Button
            variant="soft"
            onClick={() => navigate("/")}
            style={{ borderRadius: 999 }}
          >
            <ArrowLeft size={18} />
          </Button>

          <Box>
            <Heading size="6">Dashboard</Heading>
            <Text size="2" color="gray">
              Overview for {user}
            </Text>
          </Box>
        </Flex>

        {/* HERO CARD */}
        <Card
          style={{
            padding: 22,
            borderRadius: 22,
            marginBottom: 26,
            background: `linear-gradient(135deg,${theme.main},#1e40af)`,
            color: "white",
          }}
        >
          <Flex justify="between" align="center">
            <Box>
              <Text size="2" style={{ opacity: 0.85 }}>
                Active Profile
              </Text>
              <Heading size="6">{user}</Heading>
            </Box>
            <UserCircle size={44} />
          </Flex>
        </Card>

        {/* MAIN STATS */}
        <Flex gap="16px" wrap="wrap">
          {/* Calories */}
          <Card style={{ flex: 1, minWidth: 260, padding: 22, borderRadius: 20 }}>
            <Flex justify="between" align="center">
              <Flame color="#ef4444" />
              <Text size="1" color="gray">
                Today
              </Text>
            </Flex>
            <Heading size="3" mt="2">
              Calories
            </Heading>
            <Text size="7" weight="bold">
              {todayCalories}
              <Text as="span" size="3" color="gray">
                {" "}kcal
              </Text>
            </Text>
          </Card>

          {/* Wallet */}
          <Card
            style={{
              flex: 1,
              minWidth: 260,
              padding: 22,
              borderRadius: 20,
              background: "#f0fdf4",
            }}
          >
            <Flex justify="between" align="center">
              <Wallet color="#16a34a" />
              <Button
                size="1"
                variant="soft"
                onClick={() => navigate("/wallet")}
              >
                Open
              </Button>
            </Flex>
            <Heading size="3" mt="2">
              Wallet Balance
            </Heading>
            <Text size="7" weight="bold" color="#16a34a">
              ₹ {walletBalance.toFixed(2)}
            </Text>
          </Card>

          {/* Loans */}
          <Card
            style={{
              flex: 1,
              minWidth: 260,
              padding: 22,
              borderRadius: 20,
              background: "#fff7ed",
            }}
          >
            <Flex justify="between" align="center">
              <HandCoins color="#f59e0b" />
              <Text size="1" color="gray">
                Pending
              </Text>
            </Flex>
            <Heading size="3" mt="2">
              Loans
            </Heading>
            <Text size="7" weight="bold" color="#b45309">
              ₹ {pendingLoans.toFixed(2)}
            </Text>
          </Card>
        </Flex>

        <Separator my="6" />

        {/* SECOND ROW */}
        <Flex gap="16px" wrap="wrap">
          <Card style={{ flex: 1, padding: 22, borderRadius: 20 }}>
            <Heading size="4">Shared Expenses</Heading>
            <Text color="gray" size="2">
              Your contribution
            </Text>
            <Text size="6" weight="bold" mt="3">
              ₹ {totalSharedExpenses.toFixed(2)}
            </Text>
          </Card>

          <Card style={{ flex: 1, padding: 22, borderRadius: 20 }}>
            <Heading size="4">Profile Status</Heading>
            <Text color="gray" size="2">
              Currently active
            </Text>
            <Flex align="center" gap="10px" mt="3">
              <UserCircle size={28} />
              <Text size="5" weight="bold">
                {user}
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Box>
    </Box>
  );
};

export default Dashboard;
