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

const USERS = ["Tejas", "Nikita"] as const;
type User = (typeof USERS)[number];
type TabType = "Expenses" | "Loans";

type ExpenseItem = {
  id: number;
  name: string;
  amount: number;
  desc?: string;
  user: User;
  type: TabType;
  date: string;
  paid: boolean;
};

const STORAGE_KEY = "expensesData_v1";

const loadFromStorage = (): ExpenseItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const COLORS = {
  Tejas: "#4A90E2", // Blue
  Nikita: "#FC4986", // Pink
};

const ExpensesSummary: React.FC = () => {
  const navigate = useNavigate();
  const items = useMemo(loadFromStorage, []);
  
  const totals = useMemo(() => {
    const totalExpenses: Record<User, number> = { Tejas: 0, Nikita: 0 };
    const totalLoansUnpaid: Record<User, number> = { Tejas: 0, Nikita: 0 };

    items.forEach((i) => {
      if (i.type === "Expenses") totalExpenses[i.user] += i.amount;
      if (i.type === "Loans" && !i.paid) totalLoansUnpaid[i.user] += i.amount;
    });

    const tejasLoans = totalLoansUnpaid.Tejas;
    const nikitaLoans = totalLoansUnpaid.Nikita;
    let whoOwes = "";
    let diff = 0;

    if (tejasLoans > nikitaLoans) {
      diff = tejasLoans - nikitaLoans;
      whoOwes = `Tejas owes Nikita ₹${diff.toFixed(2)}`;
    } else if (nikitaLoans > tejasLoans) {
      diff = nikitaLoans - tejasLoans;
      whoOwes = `Nikita owes Tejas ₹${diff.toFixed(2)}`;
    } else {
      whoOwes = "You are settled up 🎉";
    }

    return {
      totalExpenses,
      totalLoansUnpaid,
      whoOwes,
    };
  }, [items]);

  const pieData = USERS.map((u) => ({
    name: u,
    value: totals.totalExpenses[u],
  }));

  const loanData = USERS.map((u) => ({
    name: u,
    value: totals.totalLoansUnpaid[u],
  }));

  return (
    <Box
      style={{
        minHeight: "100vh",
        padding: "24px 20px",
        background: "linear-gradient(120deg,#dcfce7,#f3e8ff,#e0f2fe)",
      }}
    >
      <Box style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Header */}
        <Flex align="center" gap="3" mb="28px">
          <Button
            variant="soft"
            onClick={() => navigate("/expenses")}
            style={{ borderRadius: 999 }}
          >
            <ArrowLeft />
          </Button>
          <Heading size="6">Expenses Summary</Heading>
        </Flex>

        {/* Pie Chart: Spending % */}
        <Card
          style={{
            padding: 16,
            borderRadius: 18,
            backgroundColor: "white",
          }}
        >
          <Heading size="4" mb="2">
            Spending Comparison 💰
          </Heading>
          <Text size="2" color="gray" mb="3">
            Total expenses between Tejas & Nikita
          </Text>

          <Box style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label={(entry) => `${entry.name} (${entry.value})`}
                >
                  {pieData.map((d, i) => (
                    <Cell key={i} fill={COLORS[d.name as User]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        <Separator my="5" />

        {/* Bar Chart: Unpaid Loans */}
        <Card
          style={{
            padding: 16,
            borderRadius: 18,
            backgroundColor: "white",
          }}
        >
          <Heading size="4" mb="2">
            Loans Breakdown 🧾
          </Heading>
          <Text size="2" color="gray" mb="3">
            Pending borrowed amounts per person
          </Text>

          <Box style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={loanData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {loanData.map((d, i) => (
                    <Cell key={i} fill={COLORS[d.name as User]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        <Separator my="5" />

        {/* Settlement */}
        <Card
          style={{
            padding: 18,
            borderRadius: 18,
            backgroundColor: "black",
            color: "white",
          }}
        >
          <Heading size="4" mb="2">
            Settle Up
          </Heading>
          <Text size="2">{totals.whoOwes}</Text>
        </Card>
      </Box>
    </Box>
  );
};

export default ExpensesSummary;
