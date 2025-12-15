import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  Heading,
  Card,
  TextField,
  TextArea,
} from "@radix-ui/themes";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";

type EntryType = "EXPENSE" | "LOAN";
type Person = "Tejas" | "Nikita";

type Entry = {
  id: string;
  type: EntryType;
  title: string;
  description?: string;
  amount: number;
  splitAmount: number;
  date: string;
  paidBy: Person;
  otherPerson: Person;
  settled: boolean;
};

const STORAGE_KEY = "simple_entries_v1";

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const todayISO = () => new Date().toISOString().slice(0, 10);

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  const [type, setType] = useState<EntryType>("EXPENSE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());

  // ✅ FIX: READ DEFAULT USER FROM HOME
  const [paidBy, setPaidBy] = useState<Person>(
    (localStorage.getItem("activeUser") as Person) || "Tejas"
  );

  const otherPerson: Person =
    paidBy === "Tejas" ? "Nikita" : "Tejas";

  // 🎨 Theme
  const theme =
    paidBy === "Tejas"
      ? { main: "#4A90E2", soft: "#e0f2fe" }
      : { main: "#ec4899", soft: "#fce7f3" };

  const numericAmount = Number(amount) || 0;
  const splitAmount =
    type === "EXPENSE"
      ? +(numericAmount / 2).toFixed(2)
      : numericAmount;

  /* ================= EDIT PREFILL ================= */
  useEffect(() => {
    if (!isEditing) return;

    const data: Entry[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    const entry = data.find((e) => e.id === editId);
    if (!entry) return;

    setType(entry.type);
    setTitle(entry.title);
    setDescription(entry.description || "");
    setAmount(entry.amount.toString());
    setDate(entry.date);
    setPaidBy(entry.paidBy);
  }, [isEditing, editId]);

  /* ================= SAVE ================= */
  const save = () => {
    if (!title.trim() || numericAmount <= 0) return;

    const data: Entry[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (isEditing) {
      const updated = data.map((e) =>
        e.id === editId
          ? {
              ...e,
              type,
              title: title.trim(),
              description: description.trim() || undefined,
              amount: numericAmount,
              splitAmount,
              date,
              paidBy,
              otherPerson,
            }
          : e
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } else {
      const newEntry: Entry = {
        id: uid(),
        type,
        title: title.trim(),
        description: description.trim() || undefined,
        amount: numericAmount,
        splitAmount,
        date,
        paidBy,
        otherPerson,
        settled: false,
      };

      data.unshift(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // ✅ KEEP USER CONSISTENT
    localStorage.setItem("activeUser", paidBy);

    navigate("/expenses");
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        padding: "24px 18px",
        background: `linear-gradient(120deg,${theme.soft},#fff)`,
      }}
    >
      <Box style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* HEADER */}
        <Flex align="center" gap="3" mb="24px">
          <Button
            variant="soft"
            onClick={() => navigate("/expenses")}
            style={{ borderRadius: 999 }}
          >
            <ArrowLeft />
          </Button>
          <Heading size="6">
            {isEditing
              ? "Edit Entry"
              : `Add ${type === "EXPENSE" ? "Expense" : "Loan"}`}
          </Heading>
        </Flex>

        {/* TYPE */}
        <Text weight="bold" mb="8px">
          What are you adding?
        </Text>
        <Flex gap="10px" mb="22px">
          {(["EXPENSE", "LOAN"] as EntryType[]).map((t) => (
            <Button
              key={t}
              onClick={() => setType(t)}
              style={{
                flex: 1,
                borderRadius: 999,
                backgroundColor: type === t ? theme.main : "#e5e7eb",
                color: type === t ? "white" : "#333",
                fontWeight: 600,
              }}
            >
              {t === "EXPENSE" ? "Expense" : "Loan"}
            </Button>
          ))}
        </Flex>

        {/* PAID BY */}
        <Text weight="bold" mb="8px">
          Who paid?
        </Text>
        <Flex gap="10px" mb="22px">
          {(["Tejas", "Nikita"] as Person[]).map((p) => (
            <Button
              key={p}
              onClick={() => {
                setPaidBy(p);
                localStorage.setItem("activeUser", p); // ✅ sync
              }}
              style={{
                flex: 1,
                borderRadius: 999,
                backgroundColor: paidBy === p ? theme.main : "#e5e7eb",
                color: paidBy === p ? "white" : "#333",
                fontWeight: 600,
              }}
            >
              {p}
            </Button>
          ))}
        </Flex>

        {/* INFO */}
        <Card
          style={{
            marginBottom: 20,
            padding: 16,
            borderRadius: 16,
            background: "#f8fafc",
          }}
        >
          <Text size="2">
            <b>{otherPerson}</b> owes <b>{paidBy}</b> ₹{splitAmount}
            {type === "EXPENSE" ? " (half share)" : ""}
          </Text>
        </Card>

        {/* TITLE */}
        <Text weight="bold" mb="6px">Title</Text>
        <TextField.Root
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          mb="16px"
        />

        {/* DESCRIPTION */}
        <Text weight="bold" mb="6px">Description</Text>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          mb="16px"
        />

        {/* AMOUNT */}
        <Text weight="bold" mb="6px">Amount (₹)</Text>
        <TextField.Root
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          mb="16px"
        />

        {/* DATE */}
        <Text weight="bold" mb="6px">Date</Text>
        <Flex align="center" gap="8px" mb="24px">
          <Calendar size={18} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              width: "100%",
            }}
          />
        </Flex>

        {/* SAVE */}
        <Button
          onClick={save}
          style={{
            width: "100%",
            height: 50,
            borderRadius: 999,
            backgroundColor: theme.main,
            color: "white",
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          {isEditing ? "Update" : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddExpense;
