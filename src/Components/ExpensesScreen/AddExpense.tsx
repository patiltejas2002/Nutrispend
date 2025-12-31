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
import { ArrowLeft, Calendar, ArrowRightLeft } from "lucide-react";

type Person = "Tejas" | "Nikita";

type Entry = {
  id: string;
  type: "LOAN";
  title: string;
  description?: string;
  amount: number;
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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());

  // Who is giving the loan
  const [paidBy, setPaidBy] = useState<Person>(
    (localStorage.getItem("activeUser") as Person) || "Tejas"
  );

  const otherPerson: Person =
    paidBy === "Tejas" ? "Nikita" : "Tejas";

  const theme =
    paidBy === "Tejas"
      ? { main: "#4A90E2", soft: "#e0f2fe" }
      : { main: "#ec4899", soft: "#fce7f3" };

  const numericAmount = Number(amount) || 0;

  /* ================= EDIT PREFILL ================= */
  useEffect(() => {
    if (!isEditing) return;

    const data: Entry[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    const entry = data.find((e) => e.id === editId);
    if (!entry) return;

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
              title: title.trim(),
              description: description.trim() || undefined,
              amount: numericAmount,
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
        type: "LOAN",
        title: title.trim(),
        description: description.trim() || undefined,
        amount: numericAmount,
        date,
        paidBy,
        otherPerson,
        settled: false,
      };

      data.unshift(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

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
            {isEditing ? "Edit Loan" : "Add Loan"}
          </Heading>
        </Flex>

        {/* WHO IS GIVING LOAN */}
        <Text weight="bold" mb="8px">
          Who is giving the loan?
        </Text>
        <Flex gap="10px" mb="18px">
          {(["Tejas", "Nikita"] as Person[]).map((p) => (
            <Button
              key={p}
              onClick={() => {
                setPaidBy(p);
                localStorage.setItem("activeUser", p);
              }}
              style={{
                flex: 1,
                borderRadius: 999,
                backgroundColor: paidBy === p ? theme.main : "#e5e7eb",
                color: paidBy === p ? "white" : "#333",
                fontWeight: 700,
              }}
            >
              {p}
            </Button>
          ))}
        </Flex>

        {/* 🔥 LOAN DIRECTION CARD */}
        <Card
          style={{
            marginBottom: 22,
            padding: 18,
            borderRadius: 18,
            background: "#fff7ed",
            border: "1px solid #fed7aa",
          }}
        >
          <Flex align="center" justify="center" gap="10px">
            <Text weight="bold" size="3">
              {otherPerson}
            </Text>
            <ArrowRightLeft />
            <Text weight="bold" size="3">
              {paidBy}
            </Text>
          </Flex>

          <Text align="center" mt="8px" size="2">
            {otherPerson} owes {paidBy} ₹{numericAmount || 0}
          </Text>
        </Card>

        {/* TITLE */}
        <Text weight="bold" mb="6px">Reason / Title</Text>
        <TextField.Root
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          mb="16px"
        />

        {/* DESCRIPTION */}
        <Text weight="bold" mb="6px">Description (optional)</Text>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          mb="16px"
        />

        {/* AMOUNT */}
        <Text weight="bold" mb="6px">Loan Amount (₹)</Text>
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
          {isEditing ? "Update Loan" : "Save Loan"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddExpense;
