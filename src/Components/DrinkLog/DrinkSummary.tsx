import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Heading,
  Text,
  Flex,
  Button,
  Separator,
} from "@radix-ui/themes";
import { ArrowLeft, BarChart3 } from "lucide-react";

type User = "Tejas" | "Nikita";

type DrinkEntry = {
  id: string;
  date: string;
  drinkAmount: number;
  chakanaAmount: number;
  people: User[];
};

const STORAGE_KEY = "drink_logs_v2";

const getActiveUser = (): User =>
  (localStorage.getItem("activeUser") as User) || "Tejas";

const DrinkSummary: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(getActiveUser());

  // 🎨 THEME
  const theme =
    user === "Tejas"
      ? { main: "#4A90E2", soft: "#e0f2fe", text: "#1e40af" }
      : { main: "#ec4899", soft: "#fce7f3", text: "#9d174d" };

  const entries: DrinkEntry[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  const totalOf = (list: DrinkEntry[]) =>
    list.reduce((s, e) => s + e.drinkAmount + e.chakanaAmount, 0);

  /* ===================== FILTERS ===================== */
  const myEntries = useMemo(
    () => entries.filter((e) => e.people.length === 1 && e.people[0] === user),
    [entries, user]
  );

  const bothEntries = useMemo(
    () => entries.filter((e) => e.people.length === 2),
    [entries]
  );

  const myTotal = totalOf(myEntries);
  const bothTotal = totalOf(bothEntries);
  const overallTotal = myTotal + bothTotal / 2;

  return (
    <Box
      style={{
        minHeight: "100vh",
        padding: "26px 18px",
        background: `linear-gradient(120deg,${theme.soft},#ffffff)`,
      }}
    >
      <Box style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* HEADER */}
        <Flex align="center" gap="10px" mb="26px">
          <Button
            variant="soft"
            onClick={() => navigate(-1)}
            style={{ borderRadius: 999 }}
          >
            <ArrowLeft />
          </Button>
          <Heading size="6" style={{ color: "#0f172a" }}>
            <BarChart3 size={20} /> Drinks Summary
          </Heading>
        </Flex>

        {/* USER TOGGLE */}
        <Flex gap="12px" mb="28px">
          {(["Tejas", "Nikita"] as User[]).map((u) => (
            <Button
              key={u}
              onClick={() => {
                setUser(u);
                localStorage.setItem("activeUser", u);
              }}
              style={{
                flex: 1,
                borderRadius: 999,
                backgroundColor: user === u ? theme.main : "#ffffff",
                color: user === u ? "#ffffff" : "#334155",
                fontWeight: 700,
                border: "1px solid #e5e7eb",
              }}
            >
              {u}
            </Button>
          ))}
        </Flex>

        {/* ===== HERO TOTAL ===== */}
        <Card
          style={{
            padding: 26,
            borderRadius: 24,
            marginBottom: 26,
            background: "#f8fafc",
            border: `2px solid ${theme.main}`,
          }}
        >
          <Text size="2" style={{ color: "#475569" }}>
            Overall Spend 🍻
          </Text>

          <Heading size="7" mt="2" style={{ color: theme.main }}>
            ₹ {overallTotal.toFixed(2)}
          </Heading>

          <Text size="1" style={{ color: theme.text }}>
            {user} + Together
          </Text>
        </Card>

        {/* ===== BREAKDOWN ===== */}
        <Flex gap="16px" wrap="wrap">
          {/* MY SPEND */}
          <Card
            style={{
              flex: 1,
              padding: 22,
              borderRadius: 20,
              border: `2px solid ${theme.main}`,
            }}
          >
            <Text size="2" style={{ color: "#475569" }}>
              Your Spend
            </Text>

            <Heading size="5" mt="2" style={{ color: theme.main }}>
              ₹ {myTotal.toFixed(2)}
            </Heading>

            <Text size="1" style={{ color: "#64748b" }}>
              {user} only
            </Text>
          </Card>

          {/* BOTH */}
          <Card
            style={{
              flex: 1,
              padding: 22,
              borderRadius: 20,
              background: "#f0fdf4",
              border: "2px solid #22c55e",
            }}
          >
            <Text size="2" style={{ color: "#166534" }}>
              Together 🍻
            </Text>

            <Heading size="5" mt="2" style={{ color: "#16a34a" }}>
              ₹ {bothTotal.toFixed(2)}
            </Heading>

            <Text size="1" style={{ color: "#166534" }}>
              Tejas + Nikita
            </Text>
          </Card>
        </Flex>

        <Separator my="6" />

        {/* ===== STATS ===== */}
        <Flex gap="16px" wrap="wrap">
          <Card style={{ flex: 1, padding: 20, borderRadius: 18 }}>
            <Text size="2" style={{ color: "#475569" }}>
              Total Sessions
            </Text>
            <Heading size="4" style={{ color: "#0f172a" }}>
              {entries.length}
            </Heading>
          </Card>

          <Card style={{ flex: 1, padding: 20, borderRadius: 18 }}>
            <Text size="2" style={{ color: "#475569" }}>
              Avg per Session
            </Text>
            <Heading size="4" style={{ color: "#0f172a" }}>
              ₹{" "}
              {entries.length === 0
                ? 0
                : (overallTotal / entries.length).toFixed(2)}
            </Heading>
          </Card>
        </Flex>
      </Box>
    </Box>
  );
};

export default DrinkSummary;
