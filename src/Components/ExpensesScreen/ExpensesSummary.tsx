import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Card,
  Text,
  Heading,
  Button,
  Separator,
} from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type User = "Tejas" | "Nikita";

type Entry = {
  id: string;
  type: "EXPENSE" | "LOAN";
  title: string;
  amount: number;
  paidBy: User;
  otherPerson: User;
  settled: boolean;
};

const STORAGE_KEY = "simple_entries_v1";

const loadFromStorage = (): Entry[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const COLORS: Record<User, string> = {
  Tejas: "#4A90E2",
  Nikita: "#ec4899",
};

const ExpensesSummary: React.FC = () => {
  const navigate = useNavigate();

  // ✅ ACTIVE USER (for theme only)
  const activeUser =
    (localStorage.getItem("activeUser") as User) || "Tejas";

  const theme =
    activeUser === "Tejas"
      ? { main: "#4A90E2", soft: "#e0f2fe" }
      : { main: "#ec4899", soft: "#fce7f3" };

  const items = useMemo(loadFromStorage, []);

  const summary = useMemo(() => {
    const totalExpenses: Record<User, number> = {
      Tejas: 0,
      Nikita: 0,
    };

    const totalLoansUnpaid: Record<User, number> = {
      Tejas: 0,
      Nikita: 0,
    };

    items.forEach((i) => {
      // EXPENSE → split equally
      if (i.type === "EXPENSE") {
        const share = i.amount / 2;
        totalExpenses[i.paidBy] += share;
        totalExpenses[i.otherPerson] += share;
      }

      // LOAN → otherPerson owes paidBy
      if (i.type === "LOAN" && !i.settled) {
        totalLoansUnpaid[i.otherPerson] += i.amount;
      }
    });

    let settleText = "You are settled up 🎉";
    const diff = totalLoansUnpaid.Tejas - totalLoansUnpaid.Nikita;

    if (diff > 0) {
      settleText = `Tejas owes Nikita ₹${diff.toFixed(2)}`;
    } else if (diff < 0) {
      settleText = `Nikita owes Tejas ₹${Math.abs(diff).toFixed(2)}`;
    }

    return { totalExpenses, totalLoansUnpaid, settleText };
  }, [items]);

  const expensePieData = (["Tejas", "Nikita"] as User[]).map((u) => ({
    name: u,
    value: summary.totalExpenses[u],
  }));

  const loanBarData = (["Tejas", "Nikita"] as User[]).map((u) => ({
    name: u,
    value: summary.totalLoansUnpaid[u],
  }));

  return (
    <Box
      style={{
        minHeight: "100vh",
        padding: "24px 20px",
        background: `linear-gradient(120deg,${theme.soft},#ffffff)`,
      }}
    >
      <Box style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* HEADER */}
        <Flex align="center" gap="3" mb="28px">
          <Button
            variant="soft"
            onClick={() => navigate("/expenses")}
            style={{ borderRadius: 999 }}
          >
            <ArrowLeft />
          </Button>
          <Heading size="6">
            Expenses Summary — {activeUser}
          </Heading>
        </Flex>

        {/* EXPENSE PIE */}
        <Card style={{ padding: 16, borderRadius: 18 }}>
          <Heading size="4" mb="2">
            Spending Split 💰
          </Heading>
          <Text size="2" color="gray" mb="3">
            Total shared expenses (50–50)
          </Text>

          <Box style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={expensePieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label={(e) =>
                    `${e.name} ₹${Number(e.value).toFixed(0)}`
                  }
                >
                  {expensePieData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[d.name as User]}
                      opacity={
                        d.name === activeUser ? 1 : 0.55
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        <Separator my="5" />

        {/* LOANS BAR */}
        <Card style={{ padding: 16, borderRadius: 18 }}>
          <Heading size="4" mb="2">
            Pending Loans 🧾
          </Heading>
          <Text size="2" color="gray" mb="3">
            Amount still to be paid
          </Text>

          <Box style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={loanBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {loanBarData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[d.name as User]}
                      opacity={
                        d.name === activeUser ? 1 : 0.55
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        <Separator my="5" />

        {/* SETTLEMENT */}
        <Card
          style={{
            padding: 18,
            borderRadius: 18,
            backgroundColor: theme.main,
            color: "white",
          }}
        >
          <Heading size="4" mb="2">
            Settle Up
          </Heading>
          <Text size="3">{summary.settleText}</Text>
        </Card>
      </Box>
    </Box>
  );
};

export default ExpensesSummary;
