import React, { useEffect, useState } from "react";
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
  Dialog,
  TextField,
} from "@radix-ui/themes";
import { ArrowLeft, Trash2 } from "lucide-react";

type User = "Tejas" | "Nikita";
type DrinkType = "Beer" | "Whisky" | "Vodka" | "Other";

const getActiveUser = (): User =>
  (localStorage.getItem("activeUser") as User) || "Tejas";

const USERS: User[] = ["Tejas", "Nikita"];

/* ===================== TYPES ===================== */
type DrinkEntry = {
  id: string;
  date: string;
  place: string;
  drink: DrinkType;
  drinkAmount: number;
  chakana: string;
  chakanaAmount: number;
  people: User[];
};

const STORAGE_KEY = "drink_logs_v2";

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const DrinkLog: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>(getActiveUser());
  const [entries, setEntries] = useState<DrinkEntry[]>([]);
  const [open, setOpen] = useState(false);

  // 🎨 THEME
  const theme =
    user === "Tejas"
      ? {
          main: "#4A90E2",
          soft: "#b3e1ffff",
          text: "#1e40af",
        }
      : {
          main: "#ec4899",
          soft: "#ffbbe2ff",
          text: "#ad1854ff",
        };

  const [form, setForm] = useState<Omit<DrinkEntry, "id">>({
    date: new Date().toISOString().split("T")[0],
    place: "",
    drink: "Beer",
    drinkAmount: 0,
    chakana: "",
    chakanaAmount: 0,
    people: [user],
  });

  /* ===================== LOAD ===================== */
  useEffect(() => {
    setEntries(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  }, []);

  /* ===================== RESET ON OPEN ===================== */
  useEffect(() => {
    if (open) {
      setForm({
        date: new Date().toISOString().split("T")[0],
        place: "",
        drink: "Beer",
        drinkAmount: 0,
        chakana: "",
        chakanaAmount: 0,
        people: [user],
      });
    }
  }, [open, user]);

  /* ===================== SAVE ===================== */
  const save = () => {
    if (!form.place || form.drinkAmount <= 0) return;

    const updated = [{ ...form, id: uid() }, ...entries];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setOpen(false);
  };

  /* ===================== DELETE ===================== */
  const remove = (id: string) => {
    if (!window.confirm("Delete this entry?")) return;
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
            <Heading size="6"> Drinks</Heading>
          </Flex>

          <Flex gap="10px">
            <Button
              variant="outline"
              onClick={() => navigate("/drinks/summary")}
              style={{
                borderRadius: 999,
                borderColor: theme.main,
                color: theme.main,
                fontWeight: 600,
                backgroundColor: "white",
              }}
            >
              Summary
            </Button>

            <Button
              onClick={() => setOpen(true)}
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
          {USERS.map((u) => (
            <Button
              key={u}
              onClick={() => {
                setUser(u);
                localStorage.setItem("activeUser", u);
              }}
              style={{
                flex: 1,
                borderRadius: 999,
                backgroundColor: user === u ? theme.main : "#f1f5f9",
                color: user === u ? "white" : "#334155",
                fontWeight: 700,
              }}
            >
              {u}
            </Button>
          ))}
        </Flex>

        {/* TABLE */}
        <Card style={{ padding: 0, borderRadius: 20 }}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>What</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">
                  Amount
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="center">
                  Who
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">
                  Action
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {entries.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} align="center">
                    <Text color="gray">No drink entries</Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                entries.map((e) => (
                  <Table.Row key={e.id}>
                    {/* DETAILS */}
                    <Table.Cell>
                      <Text weight="bold">{e.place}</Text>
                      <Text size="1" color="gray">
                        {new Date(e.date).toLocaleDateString()}
                      </Text>
                    </Table.Cell>

                    {/* WHAT */}
                    <Table.Cell>
                      <Text>
                        {e.drink === "Beer" && "🍺 Beer"}
                        {e.drink === "Whisky" && "🥃 Whisky"}
                        {e.drink === "Vodka" && "🍸 Vodka"}
                        {e.drink === "Other" && "🍻 Other"}
                      </Text>
                      <Text size="1" color="gray">
                        🍗 {e.chakana || "—"}
                      </Text>
                    </Table.Cell>

                    {/* AMOUNT */}
                    <Table.Cell align="center">
                      ₹ {(e.drinkAmount + e.chakanaAmount).toFixed(2)}
                      <Text size="1" color="gray">
                        Drink + Chakana
                      </Text>
                    </Table.Cell>

                    {/* WHO */}
                    <Table.Cell align="center">
                      <Badge
                        style={{
                          backgroundColor:
                            e.people.length === 2 ? "#dcfce7" : theme.soft,
                          color: e.people.length === 2 ? "#166534" : theme.text,
                        }}
                      >
                        {e.people.length === 2 ? "Both" : e.people[0]}
                      </Badge>
                    </Table.Cell>

                    {/* ACTION */}
                    <Table.Cell align="right">
                      <Button
                        size="1"
                        variant="ghost"
                        onClick={() => remove(e.id)}
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

      {/* ADD MODAL */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content style={{ borderRadius: 22, padding: 24 }}>
          <Heading size="4" mb="4">
            Add Drink 🍺
          </Heading>

          {/* DATE + PLACE */}
          <Flex gap="3" direction="column" mb="4">
            <Text size="2" weight="bold">
              Details
            </Text>

            <TextField.Root
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <TextField.Root
              placeholder="Where? (Home / Bar)"
              value={form.place}
              onChange={(e) => setForm({ ...form, place: e.target.value })}
            />
          </Flex>

          {/* DRINK TYPE */}
          <Box mb="4">
            <Text size="2" weight="bold" mb="1">
              Drink
            </Text>

            <select
              value={form.drink}
              onChange={(e) =>
                setForm({
                  ...form,
                  drink: e.target.value as DrinkType,
                })
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            >
              <option value="Beer">🍺 Beer</option>
              <option value="Whisky">🥃 Whisky</option>
              <option value="Vodka">🍸 Vodka</option>
              <option value="Other">🍻 Other</option>
            </select>
          </Box>

          {/* AMOUNTS */}
          <Box mb="4">
            <Text size="2" weight="bold" mb="2">
              Amounts
            </Text>

            <Flex gap="3">
              <TextField.Root
                placeholder="Drink ₹"
                type="number"
                value={form.drinkAmount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    drinkAmount: Number(e.target.value),
                  })
                }
              />

              <TextField.Root
                placeholder="Chakana ₹"
                type="number"
                value={form.chakanaAmount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    chakanaAmount: Number(e.target.value),
                  })
                }
              />
            </Flex>
          </Box>

          {/* CHAKANA TEXT */}
          <Box mb="4">
            <Text size="2" weight="bold" mb="1">
              Chakana
            </Text>

            <TextField.Root
              placeholder="Chicken / Chips / etc"
              value={form.chakana}
              onChange={(e) => setForm({ ...form, chakana: e.target.value })}
            />
          </Box>

          {/* WHO */}
          <Box mb="5">
            <Text size="2" weight="bold" mb="2">
              Who drank?
            </Text>

            <Flex gap="2">
              <Button
                variant={
                  form.people.length === 1 && form.people[0] === user
                    ? "solid"
                    : "soft"
                }
                style={{
                  backgroundColor:
                    form.people.length === 1 && form.people[0] === user
                      ? theme.main
                      : undefined,
                  color:
                    form.people.length === 1 && form.people[0] === user
                      ? "white"
                      : undefined,
                }}
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    people: [user],
                  }))
                }
              >
                {user}
              </Button>

              <Button
                variant={form.people.length === 2 ? "solid" : "soft"}
                style={{
                  backgroundColor:
                    form.people.length === 2 ? "#22c55e" : "#dcfce7",
                  color: form.people.length === 2 ? "white" : "#166534",
                  fontWeight: 600,
                }}
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    people: ["Tejas", "Nikita"],
                  }))
                }
              >
                Yeah 🍻 Both
              </Button>
            </Flex>
          </Box>

          {/* SUBMIT */}
          <Button
            onClick={save}
            style={{
              width: "100%",
              borderRadius: 999,
              fontWeight: 700,
              backgroundColor: theme.main,
              color: "white",
              padding: "14px",
              fontSize: 15,
            }}
          >
            Save Drink
          </Button>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default DrinkLog;
