// src/Components/ExpensesScreen/AddExpense.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Flex, Button, Text, Heading } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";

type Person = "Tejas" | "Nikita";
type SplitMode = "Equal" | "PaidByTejas" | "PaidByNikita";

type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  note?: string;
  date: string;
  paidBy: Person;
  splitMode: SplitMode;
  owesTo: Person | null;
  owesAmount: number;
  createdAt: number;
  paid: boolean;
};

const EXP_KEY = "expenses_v2";

const loadExpenses = (): ExpenseItem[] => {
  try {
    return JSON.parse(localStorage.getItem(EXP_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveExpenses = (arr: ExpenseItem[]) =>
  localStorage.setItem(EXP_KEY, JSON.stringify(arr));

const todayISO = () => new Date().toISOString().slice(0, 10);

// Generate unique ID
const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;
  const [toastMsg, setToastMsg] = useState("");

  // FORM STATE
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");

  const [paidBy, setPaidBy] = useState<Person>("Tejas");
  const [splitMode, setSplitMode] = useState<SplitMode>("Equal");

  const mainColor = "#4A90E2";

  useEffect(() => {
    if (isEditing) {
      const expenses = loadExpenses();
      const item = expenses.find((e) => e.id === editId);
      if (item) {
        setTitle(item.title);
        setAmount(item.amount.toString());
        setDate(item.date);
        setNote(item.note || "");
        setPaidBy(item.paidBy);
        setSplitMode(item.splitMode);
      }
    }
  }, [isEditing, editId]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2200);
  };

  // COMPUTE HOW MUCH IS OWED
  const computeOwes = (amount: number, paidBy: Person, mode: SplitMode) => {
    if (mode === "Equal") {
      return { owesTo: paidBy, owesAmount: +(amount / 2).toFixed(2) };
    }
    if (mode === "PaidByTejas") {
      return { owesTo: "Tejas", owesAmount: amount };
    }
    if (mode === "PaidByNikita") {
      return { owesTo: "Nikita", owesAmount: amount };
    }
    return { owesTo: null, owesAmount: 0 };
  };

  const handleSave = () => {
    const amt = Number(amount);

    if (!title.trim() || amt <= 0) {
      showToast("Enter valid Title & Amount");
      return;
    }

    const expenses = loadExpenses();

    const { owesTo, owesAmount } = computeOwes(amt, paidBy, splitMode);

    if (isEditing) {
      const updatedExpenses = expenses.map((e) =>
        e.id === editId
          ? {
              ...e,
              title: title.trim(),
              amount: amt,
              note: note.trim() || undefined,
              date,
              paidBy,
              splitMode,
              owesTo,
              owesAmount,
            }
          : e
      );
      saveExpenses(updatedExpenses);
      showToast("Updated Successfully!");
    } else {
      const newItem: ExpenseItem = {
        id: uid(),
        title: title.trim(),
        amount: amt,
        note: note.trim() || undefined,
        date,
        paidBy,
        splitMode,
        owesTo,
        owesAmount,
        createdAt: Date.now(),
        paid: false,
      };

      saveExpenses([newItem, ...expenses]);
      showToast("Saved Successfully!");
    }

    setTimeout(() => navigate("/expenses"), 800);
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        padding: "24px 18px",
        background: "linear-gradient(120deg,#dcfce7,#f3e8ff,#e0f2fe)",
      }}
    >
      {/* Header */}
      <Flex align="center" gap="3" mb="28px">
        <Button variant="soft" onClick={() => navigate("/expenses")}>
          <ArrowLeft />
        </Button>
        <Heading size="6">{isEditing ? "Edit Expense" : "Add Expense"}</Heading>
      </Flex>

      {/* Paid By */}
      <Text size="3" weight="bold" mb="10px">Paid By</Text>
      <Flex gap="10px" mb="24px">
        {(["Tejas", "Nikita"] as Person[]).map((p) => (
          <Button
            key={p}
            onClick={() => setPaidBy(p)}
            style={{
              flex: 1,
              borderRadius: 999,
              backgroundColor: paidBy === p ? mainColor : "#e5e7eb",
              color: paidBy === p ? "white" : "#333",
              fontWeight: 600,
            }}
          >
            {p}
          </Button>
        ))}
      </Flex>

      {/* Split Mode */}
      <Text size="3" weight="bold" mb="10px">Split Type</Text>
      <Flex gap="10px" mb="24px">
        <Button
          style={{
            flex: 1,
            borderRadius: 999,
            backgroundColor: splitMode === "Equal" ? mainColor : "#e5e7eb",
            color: splitMode === "Equal" ? "white" : "#333",
          }}
          onClick={() => setSplitMode("Equal")}
        >
          Equal Split
        </Button>

        <Button
          style={{
            flex: 1,
            borderRadius: 999,
            backgroundColor: splitMode === "PaidByTejas" ? mainColor : "#e5e7eb",
            color: splitMode === "PaidByTejas" ? "white" : "#333",
          }}
          onClick={() => setSplitMode("PaidByTejas")}
        >
          Tejas Paid Full
        </Button>

        <Button
          style={{
            flex: 1,
            borderRadius: 999,
            backgroundColor: splitMode === "PaidByNikita" ? mainColor : "#e5e7eb",
            color: splitMode === "PaidByNikita" ? "white" : "#333",
          }}
          onClick={() => setSplitMode("PaidByNikita")}
        >
          Nikita Paid Full
        </Button>
      </Flex>

      {/* Title */}
      <Text size="3" weight="bold" mb="6px">Title</Text>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Dinner, Ola ride..."
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
          marginBottom: 16,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />

      {/* Description */}
      <Text size="3" weight="bold" mb="6px">Description</Text>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional..."
        rows={3}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 16,
          marginBottom: 20,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />

      {/* Save Button */}
      <Button
        onClick={handleSave}
        style={{
          width: "100%",
          height: 50,
          borderRadius: 24,
          backgroundColor: mainColor,
          color: "white",
          fontSize: 17,
          fontWeight: 700,
        }}
      >
        {isEditing ? "Update Expense" : "Save Expense"}
      </Button>

      {/* Toast */}
      {toastMsg && (
        <Box
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111",
            color: "white",
            padding: "14px 22px",
            borderRadius: 16,
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            fontWeight: 600,
          }}
        >
          {toastMsg}
        </Box>
      )}
    </Box>
  );
};

export default AddExpense;
