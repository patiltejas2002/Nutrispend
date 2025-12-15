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
import { ArrowLeft, Trash2, CheckCircle, Edit } from "lucide-react";

type Person = "Tejas" | "Nikita";
type EntryType = "EXPENSE" | "LOAN";

type Entry = {
  id: string;
  type: EntryType;
  title: string;
  description?: string;
  amount: number;
  date: string;
  paidBy: Person;
  otherPerson: Person;
  settled: boolean;
};

const STORAGE_KEY = "simple_entries_v1";

const loadEntries = (): Entry[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const saveEntries = (arr: Entry[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

const ExpensesScreen: React.FC = () => {
  const navigate = useNavigate();

  // ✅ FIX: READ DEFAULT USER FROM HOME
  const [user, setUser] = useState<Person>(
    (localStorage.getItem("activeUser") as Person) || "Tejas"
  );

  const [items, setItems] = useState<Entry[]>([]);

  // 🎨 THEME
  const theme =
    user === "Tejas"
      ? {
          main: "#4A90E2",
          soft: "#e0f2fe",
          text: "#1e40af",
        }
      : {
          main: "#ec4899",
          soft: "#fce7f3",
          text: "#9d174d",
        };

  useEffect(() => {
    setItems(loadEntries());
  }, []);

  const relatedItems = useMemo(
    () => items.filter((i) => i.paidBy === user || i.otherPerson === user),
    [items, user]
  );

  const expenses = relatedItems.filter((i) => i.type === "EXPENSE");
  const loans = relatedItems.filter((i) => i.type === "LOAN");

  const toggleSettled = (id: string) => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, settled: !i.settled } : i
    );
    setItems(updated);
    saveEntries(updated);
  };

  const deleteEntry = (id: string) => {
    if (!window.confirm("Delete this entry?")) return;
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveEntries(updated);
  };

  const editEntry = (id: string) => {
    navigate(`/expenses/add?edit=${id}`);
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
          <Flex align="center" gap="3">
            <Button
              variant="soft"
              onClick={() => navigate("/")}
              style={{ borderRadius: 999 }}
            >
              <ArrowLeft />
            </Button>
            <Heading size="6">Expenses & Loans</Heading>
          </Flex>

          {/* ACTION BUTTONS */}
          <Flex gap="10px">
            <Button
              variant="outline"
              onClick={() => navigate("/expenses/summary")}
              style={{
                borderRadius: 999,
                borderColor: theme.main,
                color: theme.main,
                fontWeight: 600,
                backgroundColor: "white",
              }}
            >
              View Summary
            </Button>

            <Button
              onClick={() => navigate("/expenses/add")}
              style={{
                borderRadius: 999,
                backgroundColor: theme.main,
                color: "white",
                fontWeight: 600,
              }}
            >
              Add
            </Button>
          </Flex>
        </Flex>

        {/* USER TOGGLE */}
        <Flex gap="12px" mb="30px">
          {(["Tejas", "Nikita"] as Person[]).map((p) => (
            <Button
              key={p}
              onClick={() => {
                setUser(p);
                localStorage.setItem("activeUser", p); // ✅ SYNC WITH HOME
              }}
              style={{
                flex: 1,
                borderRadius: 999,
                backgroundColor: user === p ? theme.main : "#f1f5f9",
                color: user === p ? "white" : "#334155",
                fontWeight: 700,
              }}
            >
              {p}
            </Button>
          ))}
        </Flex>

        {/* ================= EXPENSES ================= */}
        <Heading size="5" mb="3" style={{ color: theme.text }}>
          Expenses
        </Heading>

        <Card style={{ padding: 0, borderRadius: 20, marginBottom: 36 }}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Who</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">
                  Amount
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">
                  Status
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">
                  Action
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {expenses.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} align="center">
                    <Text color="gray">No expenses</Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                expenses.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <Text weight="bold">{item.title}</Text>
                      <Text size="1" color="gray">
                        {item.date}
                      </Text>
                    </Table.Cell>

                    <Table.Cell>
                      {item.paidBy} → {item.otherPerson}
                    </Table.Cell>

                    <Table.Cell align="center">
                      ₹ {(item.amount / 2).toFixed(2)}
                      <Text size="1" color="gray">
                        Half share
                      </Text>
                    </Table.Cell>

                    <Table.Cell align="center">
                      <Badge
                        style={{
                          backgroundColor: item.settled
                            ? "#dcfce7"
                            : "#fef3c7",
                          color: item.settled
                            ? "#166534"
                            : "#92400e",
                        }}
                      >
                        {item.settled ? "Paid" : "Pending"}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell align="right">
                      <Flex gap="3" justify="end">
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => toggleSettled(item.id)}
                          style={{ color: "#16a34a" }}
                        >
                          <CheckCircle size={16} />
                        </Button>
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => editEntry(item.id)}
                          style={{ color: theme.main }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => deleteEntry(item.id)}
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

        {/* ================= LOANS ================= */}
        <Heading size="5" mb="3" style={{ color: theme.text }}>
          Loans
        </Heading>

        <Card style={{ padding: 0, borderRadius: 20 }}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Who</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">
                  Amount
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">
                  Status
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">
                  Action
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {loans.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} align="center">
                    <Text color="gray">No loans</Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                loans.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <Text weight="bold">{item.title}</Text>
                      <Text size="1" color="gray">
                        {item.date}
                      </Text>
                    </Table.Cell>

                    <Table.Cell>
                      {item.paidBy} → {item.otherPerson}
                    </Table.Cell>

                    <Table.Cell align="center">
                      ₹ {item.amount.toFixed(2)}
                      <Text size="1" color="gray">
                        Full amount
                      </Text>
                    </Table.Cell>

                    <Table.Cell align="center">
                      <Badge
                        style={{
                          backgroundColor: item.settled
                            ? "#dcfce7"
                            : "#fef3c7",
                          color: item.settled
                            ? "#166534"
                            : "#92400e",
                        }}
                      >
                        {item.settled ? "Settled" : "Pending"}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell align="right">
                      <Flex gap="3" justify="end">
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => toggleSettled(item.id)}
                          style={{ color: "#16a34a" }}
                        >
                          <CheckCircle size={16} />
                        </Button>
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => editEntry(item.id)}
                          style={{ color: theme.main }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => deleteEntry(item.id)}
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
      </Box>
    </Box>
  );
};

export default ExpensesScreen;
