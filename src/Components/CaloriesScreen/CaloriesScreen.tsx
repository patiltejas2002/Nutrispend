
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  Table,
  Text,
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

  const isToday = selectedDate === getDate(0);

  const theme =
    user === "Tejas"
      ? { main: "#4A90E2", soft: "#bae4ffff" }
      : { main: "#ec4899", soft: "#ffbae1ff" };

  useEffect(() => {
    setMeals(JSON.parse(localStorage.getItem("meals") || "[]"));
  }, []);

  const updateMeals = (arr: Meal[]) => {
    setMeals(arr);
    localStorage.setItem("meals", JSON.stringify(arr));
  };

  /** ✅ SORTED DAILY MEALS (Breakfast → Lunch → Snacks → Dinner) */
  const dailyMeals = useMemo(() => {
    return meals
      .filter((m) => m.user === user && m.date === selectedDate)
      .sort((a, b) => (MEAL_ORDER[a.type] || 99) - (MEAL_ORDER[b.type] || 99));
  }, [meals, user, selectedDate]);

  const totalCalories = dailyMeals.reduce((s, m) => s + m.calories, 0);

  const weeklyData = [...Array(7)]
    .map((_, i) => {
      const d = getDate(i);
      const label = i === 0 ? "Today" : i === 1 ? "Yest" : `${i}d ago`;
      const calories = meals
        .filter((m) => m.user === user && m.date === d)
        .reduce((s, m) => s + m.calories, 0);
      return { label, calories };
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
            onClick={() => navigate("/add-meal")}
            disabled={!isToday}
            style={{
              borderRadius: 999,
              backgroundColor: isToday ? theme.main : "#9ca3af",
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
                backgroundColor: user === u ? theme.main : "#f1f5f9",
                color: user === u ? "white" : "#334155",
                fontWeight: 700,
              }}
            >
              {u}
            </Button>
          ))}
        </Flex>

        {/* DATE */}
        <Flex gap="8px" wrap="wrap" mb="24px">
          {[0, 1, 2, 3, 4].map((i) => {
            const d = getDate(i);
            const label = i === 0 ? "Today" : i === 1 ? "Yest" : `${i}d ago`;
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
                {label}
              </Button>
            );
          })}

          {isToday && (
            <Button
              variant="outline"
              onClick={() => setChartOpen(true)}
              style={{
                borderRadius: 999,
                borderColor: theme.main,
                color: theme.main,
              }}
            >
              Weekly
            </Button>
          )}
        </Flex>

        {/* TABLE */}
        <Card style={{ padding: 0, borderRadius: 20 }}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Meal</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Food</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">
                  Qty
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">
                  Calories
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">
                  Action
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {dailyMeals.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} align="center">
                    <Text color="gray">No meals added</Text>
                  </Table.Cell>
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
                    <Table.Cell align="center">
                      🔥 <b>{m.calories}</b>
                    </Table.Cell>

                    <Table.Cell align="right">
                      <Flex gap="2" justify="end">
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

        {/* TOTAL + WARNING */}
        <Flex direction="column" align="end" mt="24px" gap="6px">
          <Badge
            size="3"
            style={{
              backgroundColor:
                totalCalories > DAILY_CAL_LIMIT ? "#fee2e2" : "#dcfce7",
              color: totalCalories > DAILY_CAL_LIMIT ? "#b91c1c" : "#166534",
              padding: "8px 16px",
            }}
          >
            Total: {totalCalories} / {DAILY_CAL_LIMIT} kcal
          </Badge>

          {totalCalories > DAILY_CAL_LIMIT && (
            <Text size="2" style={{ color: "#b91c1c", fontWeight: 600 }}>
              ⚠️ You are over your daily calorie limit
            </Text>
          )}
        </Flex>
      </Box>

      {/* WEEKLY BOTTOM SHEET */}
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
            <Flex justify="between" align="center" mb="3">
              <Heading size="4">Weekly Calories — {user}</Heading>
              <Button variant="ghost" onClick={() => setChartOpen(false)}>
                Close
              </Button>
            </Flex>

            <Box style={{ height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={weeklyData} style={{ outline: "none" }}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip cursor={false} />

                  <ReferenceLine
                    y={DAILY_CAL_LIMIT}
                    stroke="#ef4444"
                    strokeDasharray="6 6"
                    label={{
                      value: "2000 kcal",
                      position: "top",
                      fill: "#ef4444",
                    }}
                  />

                  <Bar
                    dataKey="calories"
                    fill={theme.main}
                    radius={[8, 8, 0, 0]}
                    stroke="none"
                    isAnimationActive
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default CaloriesScreen;
