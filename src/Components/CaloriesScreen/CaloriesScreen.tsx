import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  Table,
  Text,
  Heading,
  Separator,
  Card,
} from "@radix-ui/themes";

import { ArrowLeft, Trash2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const USERS = ["Tejas", "Nikita"] as const;
type User = (typeof USERS)[number];

const MEAL_TYPES_COLORS: Record<string, string> = {
  Breakfast: "#FF9F1C",
  Lunch: "#4A90E2",
  Dinner: "#16A34A",
  Snacks: "#C026D3",
};

type Meal = {
  id: number;
  user: User;
  type: string;
  food: string;
  quantity: number;
  calories: number;
  date: string;
};

const getDate = (daysAgo = 0) =>
  new Date(Date.now() - daysAgo * 86400000).toLocaleDateString("en-CA");

const CaloriesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<User>("Tejas");
  const [selectedDate, setSelectedDate] = useState(getDate(0));
  const [meals, setMeals] = useState<Meal[]>([]);
  const [chartOpen, setChartOpen] = useState(false);

  const isToday = selectedDate === getDate(0);

  const mainColor = selectedUser === "Tejas" ? "#4A90E2" : "#FC4986";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("meals") || "[]");
    setMeals(stored);
  }, []);

  const updateMeals = (arr: Meal[]) => {
    setMeals(arr);
    localStorage.setItem("meals", JSON.stringify(arr));
  };

  const dailyMeals = meals.filter(
    (m) => m.user === selectedUser && m.date === selectedDate
  );

  const totalCalories = dailyMeals.reduce((s, m) => s + m.calories, 0);

  const weeklyData = [...Array(7)]
    .map((_, i) => {
      const d = getDate(i);
      const label = i === 0 ? "Today" : i === 1 ? "Yest" : `${i}d ago`;
      const cals = meals
        .filter((m) => m.user === selectedUser && m.date === d)
        .reduce((s, m) => s + m.calories, 0);
      return { label, calories: cals };
    })
    .reverse();

  const deleteMeal = (id: number) =>
    window.confirm("Remove meal?") &&
    updateMeals(meals.filter((m) => m.id !== id));

  return (
    <Box
      className="mobile-padding"
      style={{
        minHeight: "100vh",
        padding: "24px 18px",
        background: "linear-gradient(125deg,#e7f9ef,#efe9ff,#e4f2ff)",
      }}
    >
      <Box style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <Flex justify="between" align="center" mb="28px">
          <Flex align="center" gap="10px">
            <Button
              variant="soft"
              onClick={() => navigate("/")}
              style={{
                borderRadius: 999,
                background: "#fff",
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              }}
            >
              <ArrowLeft size={20} />
            </Button>
            <Heading size="5" style={{ color: "#111" }}>
              Calories Tracker 🔥
            </Heading>
          </Flex>

          <Button
            onClick={() => navigate("/add-meal")}
            disabled={!isToday}
            style={{
              borderRadius: 999,
              backgroundColor: isToday ? mainColor : "#9ca3af",
              color: "white",
              paddingInline: 18,
              fontWeight: 600,
              transition: "0.3s",
            }}
          >
             Add Meal
          </Button>
        </Flex>

        <Separator my="3" />

        {/* User */}
        <Text size="3" weight="bold" mb="10px">
          Who is eating?
        </Text>
        <Flex gap="10px" mb="20px">
          {USERS.map((u) => (
            <Button
              key={u}
              onClick={() => setSelectedUser(u)}
              style={{
                flex: 1,
                borderRadius: 999,
                backgroundColor: selectedUser === u ? mainColor : "#e3e3e3",
                color: selectedUser === u ? "white" : "#333",
                fontWeight: 600,
              }}
            >
              {u}
            </Button>
          ))}
        </Flex>

        {/* Date */}
        <Text size="3" weight="bold" mb="10px">
          Select Day 📅
        </Text>
        <Flex gap="8px" wrap="wrap" mb="20px">
          {[0, 1, 2, 3, 4].map((i) => {
            const d = getDate(i);
            const label = i === 0 ? "Today" : i === 1 ? "Yest" : `${i}d ago`;
            return (
              <Button
                key={d}
                onClick={() => setSelectedDate(d)}
                style={{
                  borderRadius: 999,
                  backgroundColor: selectedDate === d ? mainColor : "#e5e7eb",
                  color: selectedDate === d ? "white" : "#333",
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
                borderColor: mainColor,
                color: mainColor,
                borderRadius: 999,
              }}
            >
              📊 Weekly
            </Button>
          )}
        </Flex>

        {/* Table */}
        <Card className="table-container" style={{ padding: 0, borderRadius: 16, overflow: "hidden" }}>
          <Table.Root>
            <Table.Header>
              <Table.Row style={{ background: "#fafafa" }}>
                <Table.ColumnHeaderCell>Meal</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Food</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">
                  Qty
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">
                  Calories
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">Action</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {dailyMeals.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} align="center">
                    <Text color="gray">No meals added yet</Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                dailyMeals.map((m) => (
                  <Table.Row key={m.id} style={{ background: "white" }}>
                    <Table.Cell
                      style={{
                        color: MEAL_TYPES_COLORS[m.type] || mainColor,
                        fontWeight: 600,
                      }}
                    >
                      {m.type}
                    </Table.Cell>
                    <Table.Cell>{m.food}</Table.Cell>
                    <Table.Cell align="center">{m.quantity}</Table.Cell>
                    <Table.Cell align="center">🔥 {m.calories}</Table.Cell>
                    <Table.Cell align="right">
                      <Button
                        variant="ghost"
                        onClick={() => deleteMeal(m.id)}
                        style={{ color: "#d30606ff" }}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Card>

        {/* Total + Status Message */}
        <Flex direction="column" justify="flex-end" mt="20px" gap="10px">
          <Box
            style={{
              padding: "6px 18px",
              backgroundColor: totalCalories > 1800 ? "#dc2626" : "#059669",
              color: "white",
              borderRadius: 999,
              fontSize: 16,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Total: {totalCalories} kcal
          </Box>

          <Box
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              textAlign: "center",
              backgroundColor: totalCalories > 1800 ? "#fee2e2" : "#dcfce7",
              color: totalCalories > 1800 ? "#b91c1c" : "#166534",
            }}
          >
            {totalCalories > 1800
              ? "⚠️ You crossed 1800 kcal! Go lighter next meal."
              : "✔️ Excellent! You're within a healthy range."}
          </Box>
        </Flex>
      </Box>

      {/* Chart Modal */}
      {chartOpen && (
        <Box
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Box
            className="mobile-modal"
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
              width: "90%",
              maxWidth: 600,
            }}
          >
            <Heading size="4" mb="2">
              📈 Weekly Calories — {selectedUser}
            </Heading>
            <Text color="gray" mb="3">
              Last 7 days overview
            </Text>

            <Box style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="calories"
                    fill={mainColor}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Flex justify="center" mt="3">
              <Button variant="solid" onClick={() => setChartOpen(false)}>
                Close
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CaloriesScreen;
