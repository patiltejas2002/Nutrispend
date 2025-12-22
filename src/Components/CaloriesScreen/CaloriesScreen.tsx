
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  Table,
  
  Heading,
  Card,
  Badge,
} from "@radix-ui/themes";
import { ArrowLeft, Trash2, Edit } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const USERS = ["Tejas", "Nikita"] as const;
type User = (typeof USERS)[number];

type Meal = {
  id: number;
  user: User;
  type: string;
  food: string;
  quantity: number;
  calories: number;
  date: string;
};

const DAILY_CAL_LIMIT = 2000;

const MEAL_ORDER: Record<string, number> = {
  Breakfast: 1,
  Lunch: 2,
  Snacks: 3,
  Dinner: 4,
};

const MEAL_COLORS: Record<string, string> = {
  Breakfast: "#f59e0b",
  Lunch: "#3b82f6",
  Snacks: "#a855f7",
  Dinner: "#16a34a",
};

const getDate = (daysAgo = 0) =>
  new Date(Date.now() - daysAgo * 86400000).toLocaleDateString("en-CA");

const CaloriesScreen: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>(
    (localStorage.getItem("activeUser") as User) || "Tejas"
  );
  const [selectedDate, setSelectedDate] = useState(getDate(0));
  const [meals, setMeals] = useState<Meal[]>([]);
  const [chartOpen, setChartOpen] = useState(false);

  const theme =
    user === "Tejas"
      ? { main: "#4A90E2", soft: "#bae4ff" }
      : { main: "#ec4899", soft: "#ffbae1" };

  useEffect(() => {
    setMeals(JSON.parse(localStorage.getItem("meals") || "[]"));
  }, []);

  const updateMeals = (arr: Meal[]) => {
    setMeals(arr);
    localStorage.setItem("meals", JSON.stringify(arr));
  };

  /** SORTED DAILY MEALS */
  const dailyMeals = useMemo(() => {
    return meals
      .filter((m) => m.user === user && m.date === selectedDate)
      .sort((a, b) => (MEAL_ORDER[a.type] || 99) - (MEAL_ORDER[b.type] || 99));
  }, [meals, user, selectedDate]);

  const totalCalories = dailyMeals.reduce((s, m) => s + m.calories, 0);

  /** LAST 6 DAYS DATA */
  const weeklyData = [...Array(6)]
    .map((_, i) => {
      const d = getDate(i);
      return {
        label: i === 0 ? "Today" : `${i} day${i > 1 ? "s" : ""} ago`,
        calories: meals
          .filter((m) => m.user === user && m.date === d)
          .reduce((s, m) => s + m.calories, 0),
      };
    })
    .reverse();

  const deleteMeal = (id: number) => {
    if (!window.confirm("Delete this meal?")) return;
    updateMeals(meals.filter((m) => m.id !== id));
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        padding: "24px 18px",
        background: `linear-gradient(120deg,${theme.soft},#ffffff)`,
      }}
    >
      <Box style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* HEADER */}
        <Flex justify="between" align="center" mb="26px">
          <Flex align="center" gap="10px">
            <Button variant="soft" onClick={() => navigate("/")}>
              <ArrowLeft />
            </Button>
            <Heading size="6">Calories Tracker</Heading>
          </Flex>

          <Button
            onClick={() => navigate(`/add-meal?date=${selectedDate}`)}
            style={{
              borderRadius: 999,
              backgroundColor: theme.main,
              color: "white",
              fontWeight: 600,
            }}
          >
            Add Meal
          </Button>
        </Flex>

        {/* USER TOGGLE */}
        <Flex gap="12px" mb="24px">
          {USERS.map((u) => (
            <Button
              key={u}
              onClick={() => {
                setUser(u);
                localStorage.setItem("activeUser", u);
              }}
              style={{
                flex: 1,
                borderRadius: 999,
                backgroundColor: user === u ? theme.main : "#e5e7eb",
                color: user === u ? "white" : "#333",
                fontWeight: 700,
              }}
            >
              {u}
            </Button>
          ))}
        </Flex>

        {/* DATE SELECTOR */}
        <Flex gap="8px" wrap="wrap" mb="24px">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const d = getDate(i);
            return (
              <Button
                key={d}
                onClick={() => setSelectedDate(d)}
                style={{
                  borderRadius: 999,
                  backgroundColor: selectedDate === d ? theme.main : "#e5e7eb",
                  color: selectedDate === d ? "white" : "#334155",
                }}
              >
                {i === 0 ? "Today" : `${i} day${i > 1 ? "s" : ""} ago`}
              </Button>
            );
          })}

          <Button
            variant="outline"
            onClick={() => setChartOpen(true)}
            style={{ borderRadius: 999 }}
          >
            Weekly
          </Button>
        </Flex>

        {/* TABLE */}
        <Card style={{ padding: 0, borderRadius: 20 }}>
          <Table.Root>
            <Table.Body>
              {dailyMeals.length === 0 ? (
                <Table.Row>
                  <Table.Cell align="center">No meals added</Table.Cell>
                </Table.Row>
              ) : (
                dailyMeals.map((m) => (
                  <Table.Row key={m.id}>
                    <Table.Cell>
                      <Badge
                        style={{
                          backgroundColor: MEAL_COLORS[m.type] || theme.main,
                          color: "white",
                        }}
                      >
                        {m.type}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{m.food}</Table.Cell>
                    <Table.Cell align="center">{m.quantity}</Table.Cell>
                    <Table.Cell align="center">🔥 {m.calories}</Table.Cell>
                    <Table.Cell align="right">
                      <Flex gap="8px" justify="end">
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => navigate(`/add-meal?edit=${m.id}`)}
                          style={{ color: theme.main }}
                        >
                          <Edit size={16} />
                        </Button>

                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => deleteMeal(m.id)}
                          style={{ color: "#dc2626" }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Card>

        {/* TOTAL */}
        <Flex direction="column" align="end" mt="20px">
          <Badge
            size="3"
            style={{
              background:
                totalCalories > DAILY_CAL_LIMIT ? "#fee2e2" : "#dcfce7",
              color: totalCalories > DAILY_CAL_LIMIT ? "#b91c1c" : "#166534",
            }}
          >
            {totalCalories} / {DAILY_CAL_LIMIT} kcal
          </Badge>
        </Flex>
      </Box>

      {/* WEEKLY CHART */}
      {chartOpen && (
        <Box
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <Card
            style={{
              width: "100%",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
            }}
          >
            <Heading size="4" mb="3">
              Weekly Calories — {user}
            </Heading>

            <Box style={{ height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip cursor={false} />
                  <ReferenceLine
                    y={DAILY_CAL_LIMIT}
                    stroke="#ef4444"
                    strokeDasharray="6 6"
                  />
                  <Bar
                    dataKey="calories"
                    fill={theme.main}
                    radius={[8, 8, 0, 0]}
                    stroke="none"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Button
              onClick={() => setChartOpen(false)}
              style={{ marginTop: 12 }}
            >
              Close
            </Button>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default CaloriesScreen;
