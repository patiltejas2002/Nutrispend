import React, { useState } from "react";
import { Box, Flex, Card, Text, Heading, Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { Flame, WalletCards, Receipt, LayoutDashboard } from "lucide-react";

// Swiper
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Assets
import Banner1 from "../assets/images/Banner1.jpg";
import Banner2 from "../assets/images/Banner2.jpg";
import Banner3 from "../assets/images/Banner3.jpg";
import Logo from "../assets/images/logo.png";

type User = "Tejas" | "Nikita";
const USERS: User[] = ["Tejas", "Nikita"];

const CALORIE_BREAKDOWN = [
  { label: "Breakfast", calories: 350, color: "#FF6363" },
  { label: "Lunch", calories: 600, color: "#FFB300" },
  { label: "Snacks", calories: 200, color: "#43aa8b" },
  { label: "Dinner", calories: 450, color: "#577590" },
];

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const getInitialUser = (): User => {
    const saved = localStorage.getItem("activeUser") as User;
    return saved && USERS.includes(saved) ? saved : "Tejas";
  };

  const [selectedUser, setSelectedUser] = useState<User>(getInitialUser);

  const handleUserChange = (user: User) => {
    setSelectedUser(user);
    localStorage.setItem("activeUser", user);
  };

  const theme =
    selectedUser === "Tejas"
      ? { main: "#4A90E2", soft: "#e0f2fe", shadow: "rgba(74,144,226,0.3)" }
      : { main: "#ec4899", soft: "#fce7f3", shadow: "rgba(236,72,153,0.3)" };

  const bg = `radial-gradient(circle at top left,${theme.soft},#f7efff 40%,#edf7ff 100%)`;

  const totalCalories = CALORIE_BREAKDOWN.reduce(
    (sum, i) => sum + i.calories,
    0
  );

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: bg,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* NAVBAR */}
      <Flex
        align="center"
        justify="between"
        style={{
          padding: "12px 16px",
          background: "#ffffff",
          borderBottom: "1px solid rgba(148,163,184,0.35)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        {/* LEFT */}
        <Flex align="center" gap="10px">
          <img
            src={Logo}
            alt="NutriSpend"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              objectFit: "cover",
            }}
          />
          <Text size="4" weight="bold">
            NutriSpend
          </Text>
        </Flex>

        {/* RIGHT → DASHBOARD BUTTON */}
        <Button
          onClick={() => navigate("/dashboard")}
          style={{
            borderRadius: 999,
            height: 36,
            background: theme.main,
            color: "white",
            fontWeight: 600,
          }}
        >
          <LayoutDashboard size={16} style={{ marginRight: 6 }} />
          Dashboard
        </Button>
      </Flex>

      {/* MAIN */}
      <Box
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "78px 16px 18px 16px",
        }}
      >
        {/* USER SWITCH */}
        <Box mb="22px">
          <Text size="2" weight="bold" align="center" mb="10px">
            Active User
          </Text>

          <Flex gap="12px" justify="center">
            {USERS.map((u) => (
              <Button
                key={u}
                onClick={() => handleUserChange(u)}
                style={{
                  flex: 1,
                  maxWidth: 140,
                  borderRadius: 999,
                  height: 44,
                  background: selectedUser === u ? theme.main : "#e5e7eb",
                  color: selectedUser === u ? "white" : "#333",
                  fontWeight: 700,
                  boxShadow:
                    selectedUser === u
                      ? `0 6px 16px ${theme.shadow}`
                      : "none",
                }}
              >
                {u}
              </Button>
            ))}
          </Flex>
        </Box>

        {/* BANNER */}
        <Box mb="22px">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000 }}
            loop
            pagination={{ clickable: true }}
            style={{ height: 220, borderRadius: 18, overflow: "hidden" }}
          >
            {[Banner1, Banner2, Banner3].map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img}
                  alt="Banner"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* PRIMARY ACTIONS */}
        <Flex direction="column" gap="10px" mb="20px">
          <Button
            onClick={() => navigate("/calories")}
            style={{
              height: 45,
              background: "#16a34a",
              color: "white",
              borderRadius: 14,
            }}
          >
            <Flame size={18} style={{ marginRight: 8 }} />
            Calories
          </Button>

          <Button
            onClick={() => navigate("/wallet")}
            style={{
              height: 45,
              background: "#4f46e5",
              color: "white",
              borderRadius: 14,
            }}
          >
            <WalletCards size={18} style={{ marginRight: 8 }} />
            Wallet
          </Button>

          <Button
            onClick={() => navigate("/expenses")}
            style={{
              height: 45,
              background: "#b80404ff",
              color: "white",
              borderRadius: 14,
            }}
          >
            <Receipt size={18} style={{ marginRight: 8 }} />
            Expenses
          </Button>
        </Flex>

        {/* CALORIE BREAKDOWN */}
        <Heading size="4" mb="3">
          🍽️ Daily Calorie Breakdown
        </Heading>

        <Card style={{ borderRadius: 18, padding: 18 }}>
          {CALORIE_BREAKDOWN.map((i) => (
            <Box key={i.label} mb="14px">
              <Flex justify="between" mb="4px">
                <Text weight="bold">{i.label}</Text>
                <Text color="gray">{i.calories} cal</Text>
              </Flex>

              <Box
                style={{
                  height: 10,
                  background: "#e5e7eb",
                  borderRadius: 999,
                }}
              >
                <Box
                  style={{
                    width: `${(i.calories / totalCalories) * 100}%`,
                    height: "100%",
                    background: i.color,
                    borderRadius: 999,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Card>
      </Box>
    </Box>
  );
};

export default HomeScreen;
