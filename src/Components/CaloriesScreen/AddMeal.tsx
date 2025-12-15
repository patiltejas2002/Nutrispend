/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  // ✅ DEFAULT USER FROM HOME
  const [selectedUser, setSelectedUser] = useState<User>(
    (localStorage.getItem("activeUser") as User) || "Tejas"
  );

  const theme =
    selectedUser === "Tejas"
      ? { main: "#4A90E2", soft: "#e0f2fe", shadow: "#4A90E266" }
      : { main: "#FC4986", soft: "#fce7f3", shadow: "#FC498666" };

  const [selectedDate, setSelectedDate] = useState(getDate());
  const [mealType, setMealType] = useState<MealType | "">("");
  const [search, setSearch] = useState("");
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("1");

  const [manualCalories, setManualCalories] = useState("");
  const [isManual, setIsManual] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const filteredFoods =
    search && !isManual
      ? foodOptions.filter((f) =>
          f.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  const calories = isManual
    ? Number(manualCalories || 0) * Number(quantity || 1)
    : food
    ? (FoodData as any)[food] * Number(quantity || 1)
    : 0;

  const handleSelectFood = (f: string) => {
    setFood(f);
    setSearch(f);
    setIsManual(false);
    setManualCalories("");
  };

  const enableManual = () => {
    setIsManual(true);
    setFood(search);
    setManualCalories("");
  };

  const saveMeal = () => {
    if (!mealType || !food || calories <= 0) {
      alert("Please fill all required fields");
      return;
    }

    const stored = JSON.parse(localStorage.getItem("meals") || "[]");

    const meal = {
      id: isEditing ? Number(editId) : Date.now(),
      user: selectedUser,
      type: mealType,
      food,
      quantity: Number(quantity),
      calories,
      date: selectedDate,
    };

    const updated = isEditing
      ? stored.map((m: any) => (m.id === meal.id ? meal : m))
      : [...stored, meal];

    localStorage.setItem("meals", JSON.stringify(updated));

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/calories");
    }, 900);
  };

  // Scroll search list
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
  }, [search]);

  // ✅ EDIT MODE PREFILL (OVERRIDES activeUser)
  useEffect(() => {
    if (isEditing && editId) {
      const stored = JSON.parse(localStorage.getItem("meals") || "[]");
      const meal = stored.find((m: any) => m.id === Number(editId));

      if (meal) {
        setSelectedUser(meal.user);
        setSelectedDate(meal.date);
        setMealType(meal.type);
        setFood(meal.food);
        setSearch(meal.food);
        setQuantity(meal.quantity.toString());
        setManualCalories(
          meal.food in FoodData ? "" : meal.calories.toString()
        );
        setIsManual(!(meal.food in FoodData));
      }
    }
  }, []);

  return (
    <Box
      style={{
        minHeight: "100vh",
        padding: "24px 18px",
        background: `linear-gradient(120deg,${theme.soft},#ffffff)`,
      }}
    >
      {/* HEADER */}
      <Flex align="center" gap="3" mb="24px">
        <Button variant="soft" onClick={() => navigate("/calories")}>
          <ArrowLeft />
        </Button>
        <Heading size="6">{isEditing ? "Edit Meal" : "Add Meal"}</Heading>
      </Flex>

      {/* USER */}
      <Text weight="bold">Who’s eating?</Text>
      <Flex gap="10px" mb="22px">
        {USERS.map((u) => (
          <Button
            key={u}
            onClick={() => {
              setSelectedUser(u);
              localStorage.setItem("activeUser", u);
            }}
            style={{
              flex: 1,
              borderRadius: 20,
              background: selectedUser === u ? theme.main : "#e5e7eb",
              color: selectedUser === u ? "white" : "#333",
              border:
                selectedUser === u
                  ? `2px solid ${theme.main}`
                  : "2px solid transparent",
              boxShadow:
                selectedUser === u ? `0 4px 12px ${theme.shadow}` : "none",
              fontWeight: 700,
            }}
          >
            {u}
          </Button>
        ))}
      </Flex>

      {/* DATE */}
      <Text weight="bold">Date</Text>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 16,
          marginBottom: 20,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />

      {/* MEAL TYPE */}
      <Text weight="bold">Meal Type</Text>
      <Flex gap="10px" wrap="wrap" mb="20px">
        {MEAL_TYPES.map((m) => (
          <Button
            key={m}
            onClick={() => setMealType(m)}
            style={{
              flex: "1 1 48%",
              height: 48,
              borderRadius: 16,
              background: mealType === m ? "#22c55e" : "#e5e7eb",
              color: mealType === m ? "white" : "#333",
            }}
          >
            {mealIcons[m]} {m}
          </Button>
        ))}
      </Flex>

      {/* FOOD SEARCH */}
      <Text weight="bold">Food</Text>
      <input
        placeholder="Search or type food name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 16,
          marginBottom: 12,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />

      {/* FOOD LIST */}
      {!isManual && filteredFoods.length > 0 && (
        <Box
          ref={scrollRef}
          style={{
            maxHeight: 180,
            overflowY: "auto",
            background: "white",
            borderRadius: 14,
            padding: 10,
            marginBottom: 10,
          }}
        >
          {filteredFoods.map((f) => (
            <Box
              key={f}
              onClick={() => handleSelectFood(f)}
              style={{
                padding: 10,
                cursor: "pointer",
                borderRadius: 10,
              }}
            >
              {f} — {(FoodData as any)[f]} kcal
            </Box>
          ))}
        </Box>
      )}

      {/* MANUAL OPTION */}
      {search && filteredFoods.length === 0 && !isManual && (
        <Button variant="outline" onClick={enableManual} mb="14px">
          Add "{search}" manually
        </Button>
      )}

      {/* MANUAL CALORIES */}
      {isManual && (
        <input
          placeholder="Calories per serving"
          type="number"
          value={manualCalories}
          onChange={(e) => setManualCalories(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 16,
            marginBottom: 16,
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        />
      )}

      {/* QTY + CALORIES */}
      <Flex justify="between" align="center" mb="16px">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{
            width: 80,
            padding: 10,
            borderRadius: 12,
            textAlign: "center",
            fontWeight: 600,
            border: "none",
          }}
        />
        <Text weight="bold">🔥 {calories} kcal</Text>
      </Flex>

      {/* SAVE */}
      <Button
        onClick={saveMeal}
        style={{
          width: "100%",
          height: 48,
          borderRadius: 24,
          background: "#16a34a",
          color: "white",
          fontWeight: 700,
        }}
      >
        Save Meal
      </Button>

      {/* TOAST */}
      {showToast && (
        <Box
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111",
            color: "white",
            padding: "12px 16px",
            borderRadius: 16,
            fontWeight: 600,
          }}
        >
          Saved!
        </Box>
      )}
    </Box>
  );
};

export default AddMeal;
