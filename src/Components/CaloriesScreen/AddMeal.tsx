import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Button, Text, Heading } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";
import FoodData from "../../assets/foodData.json";

const USERS = ["Tejas", "Nikita"] as const;
type User = (typeof USERS)[number];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;
type MealType = (typeof MEAL_TYPES)[number];

const getDate = () => new Date().toLocaleDateString("en-CA");
const foodOptions = Object.keys(FoodData);

const mealIcons: Record<MealType, string> = {
  Breakfast: "🍳",
  Lunch: "🍛",
  Dinner: "🍽️",
  Snacks: "🍪",
};

const AddMeal: React.FC = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<User>("Tejas");
  const [selectedDate, setSelectedDate] = useState(getDate());
  const [mealType, setMealType] = useState<MealType | "">("");
  const [search, setSearch] = useState("");
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [showToast, setShowToast] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const savedRecent =
    JSON.parse(localStorage.getItem("recentFoods") || "[]") || [];
  const [recentFoods, setRecentFoods] = useState<string[]>(savedRecent);

  const filteredFoods = search
    ? foodOptions.filter((f) => f.toLowerCase().includes(search.toLowerCase()))
    : [];

  const calories = food && quantity ? FoodData[food] * Number(quantity) : 0;

  const handleSelectFood = (f: string) => {
    setFood(f);
    setSearch(f);

    const updated = [f, ...recentFoods.filter((item) => item !== f)].slice(
      0,
      5
    );
    setRecentFoods(updated);
    localStorage.setItem("recentFoods", JSON.stringify(updated));
  };

  const saveMeal = () => {
    if (!mealType || !food) return alert("Missing fields");

    const stored = JSON.parse(localStorage.getItem("meals") || "[]");
    stored.push({
      id: Date.now(),
      user: selectedUser,
      type: mealType,
      food,
      quantity: Number(quantity),
      calories,
      date: selectedDate,
    });
    localStorage.setItem("meals", JSON.stringify(stored));

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/calories");
    }, 1000);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
  }, [food, search]);

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "24px 18px",
        background: "linear-gradient(120deg,#dcfce7,#f3e8ff,#e0f2fe)",
      }}
    >
      {/* Header */}
      <Flex align="center" gap="3" mb="28px">
        <Button variant="soft" onClick={() => navigate("/calories")}>
          <ArrowLeft />
        </Button>
        <Heading size="6">Add Meal</Heading>
      </Flex>

      {/* Who */}
      <Text size="3" weight="bold" mb="6px">
        Who’s eating?
      </Text>
      <Flex gap="10px" mb="22px">
        {USERS.map((u) => {
          const isActive = selectedUser === u;
          const color = u === "Tejas" ? "#4A90E2" : "#FC4986";
          const colorSoft = u === "Tejas" ? "#3B7FCC" : "#E33B78";

          return (
            <Button
              key={u}
              onClick={() => setSelectedUser(u)}
              style={{
                flex: 1,
                borderRadius: "20px",
                background: isActive ? color : "#e5e7eb",
                color: isActive ? "white" : "#333",
                boxShadow: isActive ? `0 6px 14px ${color}55` : "none",
                border: isActive
                  ? `2px solid ${colorSoft}`
                  : "2px solid transparent",
                transition: "0.25s",
              }}
            >
              {u}
            </Button>
          );
        })}
      </Flex>

      {/* Date */}
      <Text size="3" weight="bold" mb="6px">
        Date
      </Text>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          padding: "14px",
          fontSize: "16px",
          borderRadius: "16px",
          width: "100%",
          marginBottom: "26px",
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />

      {/* Meal Type */}
      <Text size="3" weight="bold" mb="6px">
        Meal Type
      </Text>
      <Flex gap="10px" mb="24px" wrap="wrap">
        {MEAL_TYPES.map((m) => (
          <Button
            key={m}
            onClick={() => setMealType(m)}
            style={{
              flex: "1 1 48%",
              height: "50px",
              borderRadius: "16px",
              background: mealType === m ? "#22c55e" : "#e5e7eb",
              color: mealType === m ? "white" : "#333",
              transition: "0.2s",
            }}
          >
            {mealIcons[m]} {m}
          </Button>
        ))}
      </Flex>

      {/* Search Food */}
      <Text size="3" weight="bold" mb="8px">
        Search Food
      </Text>
      <input
        placeholder="Rice, egg, bread..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "16px",
          marginBottom: "12px",
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />

      {/* Food list */}
      <Box
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          background: "rgba(255,255,255,0.8)",
          borderRadius: "16px",
          padding: "10px",
          marginBottom: "22px",
        }}
      >
        {filteredFoods.map((f) => (
          <Box
            key={f}
            onClick={() => handleSelectFood(f)}
            style={{
              padding: "12px 14px",
              marginBottom: "8px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 500,
              background: food === f ? "#4A90E2" : "white",
              color: food === f ? "white" : "#222",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
              transition: "0.15s",
            }}
          >
            {f} — {FoodData[f]} cal
          </Box>
        ))}
      </Box>

      {/* Bottom actions */}
      <Flex justify="space-between" mb="14px" align="center">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{
            width: "80px",
            padding: "10px",
            fontSize: "18px",
            fontWeight: 600,
            borderRadius: "12px",
            textAlign: "center",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        />
        <Text weight="bold" style={{ fontSize: "19px" }}>
          🔥 {calories} kcal
        </Text>
      </Flex>

      {/* Save button */}
      <Button
        onClick={saveMeal}
        style={{
          width: "100%",
          height: "40px",
          borderRadius: "24px",
          backgroundColor: "#229e46",
          color: "white",
          fontSize: "18px",
          fontWeight: 700,
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
        }}
      >
        Save Meal
      </Button>

      {/* Toast */}
      {showToast && (
        <Box
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#22c55e",
            color: "white",
            padding: "12px 20px",
            borderRadius: "16px",
            boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
            animation: "slideUp 0.5s ease-out",
          }}
        >
          Meal Saved! 🎉
        </Box>
      )}
    </Box>
  );
};

export default AddMeal;
