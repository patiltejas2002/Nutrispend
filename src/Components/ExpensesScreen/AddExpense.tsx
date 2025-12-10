// src/Components/ExpensesScreen/AddExpense.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Button, Text, Heading } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";

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
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items: ExpenseItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const getToday = () => new Date().toISOString().split("T")[0];

const AddExpense: React.FC = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabType>("Expenses");
  const [user, setUser] = useState<User>("Tejas");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(getToday());
  const [split, setSplit] = useState(false);

  const mainColor = user === "Tejas" ? "#4A90E2" : "#FC4986";

  const handleSave = () => {
    const amt = Number(amount);
    if (!title || !amt || amt <= 0) {
      alert("Enter valid Title & Amount");
      return;
    }

    const existing = loadFromStorage();
    const now = Date.now();

    const makeItem = (u: User, value: number): ExpenseItem => ({
      id: now + Math.random(),
      name: title,
      amount: value,
      desc,
      user: u,
      type: tab,
      date,
      paid: false,
    });

    let newItems: ExpenseItem[] = [];

    if (tab === "Expenses") {
      if (split) {
        const half = amt / 2;
        newItems = [makeItem("Tejas", half), makeItem("Nikita", half)];
      } else {
        newItems = [makeItem(user, amt)];
      }
    } else {
      newItems = [makeItem(user, amt)];
    }

    saveToStorage([...existing, ...newItems]);
    navigate("/expenses");
  };

  return (
    <Box
      className="mobile-padding"
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
        <Button variant="soft" onClick={() => navigate("/expenses")}>
          <ArrowLeft />
        </Button>
        <Heading size="6">Add Entry</Heading>
      </Flex>

      {/* Type Toggle */}
      <Text size="3" weight="bold" mb="10px">Type</Text>
      <Flex gap="10px" mb="24px">
        {(["Expenses", "Loans"] as TabType[]).map((t) => (
          <Button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              borderRadius: 999,
              backgroundColor: tab === t ? mainColor : "#e5e7eb",
              color: tab === t ? "white" : "#333",
              fontWeight: 600,
              transition: "0.2s",
            }}
          >
            {t}
          </Button>
        ))}
      </Flex>

      {/* User Toggle */}
      <Text size="3" weight="bold" mb="10px">Who?</Text>
      <Flex gap="10px" mb="24px">
        {USERS.map((u) => (
          <Button
            key={u}
            onClick={() => setUser(u)}
            style={{
              flex: 1,
              borderRadius: 999,
              backgroundColor:
                user === u
                  ? u === "Tejas"
                    ? "#4A90E2"
                    : "#FC4986"
                  : "#e5e7eb",
              color: user === u ? "white" : "#333",
              fontWeight: 600,
            }}
          >
            {u}
          </Button>
        ))}
      </Flex>

      {/* Title */}
      <Text size="3" weight="bold" mb="6px">Title</Text>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Dinner, Ola ride, etc..."
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 16,
          marginBottom: 16,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />

      {/* Amount */}
      <Text size="3" weight="bold" mb="6px">Amount (₹)</Text>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 16,
          marginBottom: 16,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />

      {/* Date */}
      <Text size="3" weight="bold" mb="6px">Date</Text>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 16,
          marginBottom: 20,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />

      {/* Description */}
      <Text size="3" weight="bold" mb="6px">Description</Text>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={3}
        placeholder="Optional notes..."
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 16,
          resize: "vertical",
          marginBottom: 20,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />

      {/* Split option */}
      {tab === "Expenses" && (
        <label
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 30,
            fontWeight: 600,
          }}
        >
          <input
            type="checkbox"
            checked={split}
            onChange={(e) => setSplit(e.target.checked)}
          />
          Split equally between Tejas & Nikita
        </label>
      )}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        style={{
          width: "100%",
          height: "48px",
          borderRadius: 24,
          backgroundColor: mainColor,
          color: "white",
          fontSize: "17px",
          fontWeight: "bold",
        }}
      >
        Save
      </Button>
    </Box>
  );
};

export default AddExpense;
