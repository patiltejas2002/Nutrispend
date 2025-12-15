import React, { useEffect, useMemo, useState } from "react";
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
import { Trash2, BarChart2, ArrowLeft, Edit } from "lucide-react";

const USERS = ["Tejas", "Nikita"] as const;
type User = (typeof USERS)[number];

type TabType = "SplitExpenses" | "PaidExpenses" | "Loans";

type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  note?: string;
  date: string;
  paidBy: User;
  splitMode: "Equal" | "PaidByTejas" | "PaidByNikita";
  owesTo: User | null;
  owesAmount: number;
  createdAt: number;
  paid: boolean;
};

const STORAGE_KEY = "expenses_v2";
const loadFromStorage = (): ExpenseItem[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const saveToStorage = (items: ExpenseItem[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

const ExpensesScreen: React.FC = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabType>("SplitExpenses");
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | "ALL">("ALL");

  const mainColor = "#4A90E2"; 

  useEffect(() => {
    setItems(loadFromStorage());
  }, []);

  const updateItems = (arr: ExpenseItem[]) => {
    setItems(arr);
    saveToStorage(arr);
  };

  const filteredItems = useMemo(() => {
    let base = items.filter((i) => {
      if (tab === "SplitExpenses") return i.splitMode === "Equal" && i.paid === true;
      if (tab === "PaidExpenses") return (i.splitMode === "PaidByTejas" || i.splitMode === "PaidByNikita") && i.paid === true;
      if (tab === "Loans") return i.paid === false;
      return false;
    });
    if (selectedDate !== "ALL") base = base.filter((i) => i.date === selectedDate);
    return base.sort((a, b) => b.date.localeCompare(a.date));
  }, [items, tab, selectedDate]);

  const totalAmount = filteredItems.reduce((sum, i) => sum + i.amount, 0);

  const uniqueDates = useMemo(() => {
    const set = new Set<string>();
    items
      .filter((i) => {
        if (tab === "SplitExpenses") return i.splitMode === "Equal" && i.paid === true;
        if (tab === "PaidExpenses") return (i.splitMode === "PaidByTejas" || i.splitMode === "PaidByNikita") && i.paid === true;
        if (tab === "Loans") return i.paid === false;
        return false;
      })
      .forEach((i) => set.add(i.date));
    return ["ALL", ...Array.from(set).sort().reverse()];
  }, [items, tab]);

  const deleteEntry = (id: string) => {
    if (!window.confirm("Delete entry?")) return;
    updateItems(items.filter((i) => i.id !== id));
  };

  const togglePaid = (id: string) => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, paid: !i.paid } : i
    );
    updateItems(updated);
  };

  return (
    <Box
      className="mobile-padding"
      style={{
        minHeight: "100vh",
        padding: "24px 18px",
        background: "linear-gradient(120deg,#dcfce7,#f3e8ff,#e0f2fe)",
      }}
    >
      <Box style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <Flex justify="between" align="center" mb="32px">
          <Flex align="center" gap="3">
            <Button
              variant="soft"
              onClick={() => navigate("/")}
              style={{ borderRadius: 999 }}
            >
              <ArrowLeft size={20} />
            </Button>
            <Heading size="6" style={{ color: "#000" }}>
              Expenses & Loans 💰
            </Heading>
          </Flex>

          <Flex direction="column" gap="2">
            <Button
              onClick={() => navigate("/expenses/add")}
              style={{
                borderRadius: 999,
                backgroundColor: mainColor,
                color: "white",
                fontWeight: 600,
              }}
            >
              {tab === "Loans" ? "Add Loan" : "Add Expense"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/expenses/summary")}
              style={{
                borderRadius: 999,
                borderColor: mainColor,
                color: mainColor,
                fontWeight: 600,
              }}
            >
              <BarChart2 size={18} /> Summary
            </Button>
          </Flex>
        </Flex>

        <Separator my="3" />

        {/* Tabs */}
        <Text size="3" weight="bold" mb="10px">What to track?</Text>
        <Flex gap="10px" mb="22px">
          {(["SplitExpenses", "PaidExpenses", "Loans"] as TabType[]).map((t) => (
            <Button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                borderRadius: 999,
                background: tab === t ? mainColor : "#e5e7eb",
                color: tab === t ? "white" : "#333",
                fontWeight: 600,
              }}
            >
              {t === "SplitExpenses" ? "Split Expenses" : t === "PaidExpenses" ? "Paid Expenses" : "Loans"}
            </Button>
          ))}
        </Flex>

        {/* Date Filter */}
        <Text size="3" weight="bold" mb="10px">Date filter</Text>
        <Flex gap="6px" wrap="wrap" mb="20px">
          {uniqueDates.map((d) => (
            <Button
              key={d}
              onClick={() => setSelectedDate(d)}
              style={{
                borderRadius: 999,
                backgroundColor:
                  selectedDate === d ? mainColor : "#e5e7eb",
                color: selectedDate === d ? "white" : "#333",
                paddingInline: 18,
                fontSize: 13,
              }}
            >
              {d === "ALL" ? "All" : d}
            </Button>
          ))}
        </Flex>

        {/* Table */}
        <Card className="table-container" style={{ padding: 0, borderRadius: 18, overflow: "hidden" }}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Who</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">Amount</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">Action</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {filteredItems.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} align="center">
                    <Text>No entries for this filter</Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredItems.map((item) => (
                  <Table.Row key={item.id} style={{ background: "white" }}>
                    <Table.Cell>
                      <Text weight="bold">{item.title}</Text>
                      {item.note && (
                        <Text as="div" color="gray" size="1">
                          {item.note}
                        </Text>
                      )}
                    </Table.Cell>
                    <Table.Cell>{item.paidBy}</Table.Cell>
                    <Table.Cell>{item.date}</Table.Cell>
                    <Table.Cell align="center">
                      ₹ {item.amount.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell align="center">
                      <Button
                        size="1"
                        variant="soft"
                        onClick={() => togglePaid(item.id)}
                        style={{
                          borderRadius: 999,
                          backgroundColor: item.paid ? "#16a34a1a" : "#e5e7eb",
                          color: item.paid ? "#16a34a" : "#333",
                        }}
                      >
                        {item.paid ? "Paid" : "Unpaid"}
                      </Button>
                    </Table.Cell>
                    <Table.Cell align="right">
                      <Flex gap="1">
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => navigate(`/expenses/add?edit=${item.id}`)}
                          style={{ color: "#4A90E2" }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => deleteEntry(item.id)}
                          style={{ color: "#d30606" }}
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

        {/* Total */}
        <Flex justify="end" mt="14px">
          <Box
            style={{
              padding: "6px 18px",
              backgroundColor: "#000",
              color: "white",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            Total: ₹ {totalAmount.toFixed(2)}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ExpensesScreen;
