import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Button,
  Table,
  Text,
  Heading,
  Card,
  Dialog,
  TextField,
} from "@radix-ui/themes";
import {
  Plus,
  Minus,
  Trash2,
  X,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type User = "Tejas" | "Nikita";
type EntryType = "CREDIT" | "DEBIT";

type WalletEntry = {
  id: string;
  user: User;
  type: EntryType;
  title: string;
  amount: number;
  date: string;
  balanceAfter: number;
};

const STORAGE_KEY = "wallet_entries_v1";

const loadEntries = (): WalletEntry[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const saveEntries = (arr: WalletEntry[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const WalletExpense: React.FC = () => {
  const navigate = useNavigate();

  // ✅ DEFAULT USER FROM HOME
  const [user, setUser] = useState<User>(
    (localStorage.getItem("activeUser") as User) || "Tejas"
  );

  const [entries, setEntries] = useState<WalletEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<EntryType>("CREDIT");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [toast, setToast] = useState("");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const theme =
    user === "Tejas"
      ? { main: "#4A90E2", soft: "#e0f2fe" }
      : { main: "#ec4899", soft: "#fce7f3" };

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

const userEntries = useMemo(() => {
  return entries
    .filter((e) => e.user === user)
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });
}, [entries, user, sortOrder]);

  const walletBalance =
    userEntries.length > 0
      ? userEntries[userEntries.length - 1].balanceAfter
      : 0;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const saveEntry = () => {
    const amt = Number(amount);
    if (!title.trim() || amt <= 0) {
      showToast("Enter valid title & amount");
      return;
    }

    const newBalance =
      type === "CREDIT"
        ? walletBalance + amt
        : walletBalance - amt;

    const newEntry: WalletEntry = {
      id: uid(),
      user,
      type,
      title: title.trim(),
      amount: amt,
      date: new Date().toISOString(),
      balanceAfter: newBalance,
    };

    const updated = [...entries, newEntry];
    setEntries(updated);
    saveEntries(updated);

    setOpen(false);
    setTitle("");
    setAmount("");
    showToast(type === "CREDIT" ? "Money added 💸" : "Expense added 🍔");
  };

  const deleteEntry = (id: string) => {
    if (!window.confirm("Delete entry?")) return;

    const remaining = entries.filter((e) => e.id !== id);

    // ✅ RECALCULATE BALANCE FOR CURRENT USER ONLY
    let balance = 0;
    const recalculated = remaining.map((e) => {
      if (e.user !== user) return e;

      balance =
        e.type === "CREDIT"
          ? balance + e.amount
          : balance - e.amount;

      return { ...e, balanceAfter: balance };
    });

    setEntries(recalculated);
    saveEntries(recalculated);
    showToast("Entry deleted");
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        padding: "18px 14px",
        background: `linear-gradient(120deg,${theme.soft},#ffffff)`,
      }}
    >
      <Box style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* HEADER */}
        <Flex align="center" gap="10px" mb="20px">
          <Button
            variant="soft"
            onClick={() => navigate("/")}
            style={{ borderRadius: 999, padding: 8 }}
          >
            <ArrowLeft size={18} />
          </Button>
          <Heading size="4">Wallet</Heading>
        </Flex>

        {/* USER TOGGLE */}
        <Flex gap="10px" mb="24px">
          {(["Tejas", "Nikita"] as User[]).map((u) => (
            <Button
              key={u}
              onClick={() => {
                setUser(u);
                localStorage.setItem("activeUser", u);
              }}
              style={{
                flex: 1,
                borderRadius: 999,
                backgroundColor: user === u ? theme.main : "#e5e7eb",
                color: user === u ? "white" : "#333",
                fontWeight: 700,
              }}
            >
              {u}
            </Button>
          ))}
        </Flex>

        {/* WALLET CARD */}
        <Card style={{ padding: 22, borderRadius: 20, marginBottom: 20 }}>
          <Text size="2" color="gray">
            {user}'s Wallet Balance
          </Text>
          <Heading size="8">₹ {walletBalance.toFixed(2)}</Heading>

          <Flex gap="10px" mt="16px">
            <Button
              onClick={() => {
                setType("CREDIT");
                setOpen(true);
              }}
              style={{
                flex: 1,
                borderRadius: 999,
                backgroundColor: "#16a34a",
                color: "white",
              }}
            >
              <Plus size={16} /> Add Money
            </Button>

            <Button
              onClick={() => {
                setType("DEBIT");
                setOpen(true);
              }}
              style={{
                flex: 1,
                borderRadius: 999,
                backgroundColor: "#dc2626",
                color: "white",
              }}
            >
              <Minus size={16} /> Add Expense
            </Button>
          </Flex>
        </Card>

        {/* SORTING CONTROLS */}
        <Flex gap="10px" mb="16px" justify="end">
          <Button
            variant={sortOrder === 'newest' ? 'solid' : 'soft'}
            onClick={() => setSortOrder('newest')}
            style={{
              borderRadius: 999,
              backgroundColor: sortOrder === 'newest' ? theme.main : undefined,
              color: sortOrder === 'newest' ? 'white' : undefined,
            }}
          >
            Newest First
          </Button>
          <Button
            variant={sortOrder === 'oldest' ? 'solid' : 'soft'}
            onClick={() => setSortOrder('oldest')}
            style={{
              borderRadius: 999,
              backgroundColor: sortOrder === 'oldest' ? theme.main : undefined,
              color: sortOrder === 'oldest' ? 'white' : undefined,
            }}
          >
            Oldest First
          </Button>
        </Flex>

        {/* TABLE */}
        <Card style={{ padding: 0, borderRadius: 18, overflowX: "auto", border: '1px solid #e5e7eb' }}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">
                  Amount
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">
                  Balance
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">
                  Action
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {userEntries.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} align="center" style={{ padding: '20px' }}>
                    No entries yet
                  </Table.Cell>
                </Table.Row>
              ) : (
                userEntries.map((e) => (
                  <Table.Row key={e.id} style={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                    <Table.Cell style={{ padding: '12px' }}>
                      <Text weight="bold">{e.title}</Text>
                      <Text size="1" color="gray">
                        {e.type}
                      </Text>
                    </Table.Cell>
                    <Table.Cell style={{ padding: '12px' }}>{e.date}</Table.Cell>
                    <Table.Cell align="center" style={{ padding: '12px' }}>
                      <Text
                        style={{
                          color:
                            e.type === "CREDIT"
                              ? "#16a34a"
                              : "#dc2626",
                        }}
                      >
                        {e.type === "CREDIT" ? "+" : "-"}₹ {e.amount}
                      </Text>
                    </Table.Cell>
                    <Table.Cell align="center" style={{ padding: '12px' }}>
                      ₹ {e.balanceAfter.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell align="right" style={{ padding: '12px' }}>
                      <Button
                        size="1"
                        variant="ghost"
                        onClick={() => deleteEntry(e.id)}
                        style={{ color: "#dc2626" }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Card>
      </Box>

      {/* MODAL */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content style={{ borderRadius: 20, padding: 22 }}>
          <Flex justify="between" align="center" mb="3">
            <Heading size="4">
              {type === "CREDIT" ? "Add Money" : "Add Expense"}
            </Heading>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </Flex>

          <TextField.Root
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb="3"
          />
          <TextField.Root
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            mb="4"
          />

          <Button
            onClick={saveEntry}
            style={{
              width: "100%",
              borderRadius: 999,
              backgroundColor: theme.main,
              color: "white",
              fontWeight: 700,
            }}
          >
            Save
          </Button>
        </Dialog.Content>
      </Dialog.Root>

      {/* TOAST */}
      {toast && (
        <Box
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111",
            color: "white",
            padding: "12px 22px",
            borderRadius: 999,
            fontWeight: 600,
            zIndex: 9999,
          }}
        >
          {toast}
        </Box>
      )}
    </Box>
  );
};

export default WalletExpense;
