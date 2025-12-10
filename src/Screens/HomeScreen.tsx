import React from "react";
import {
  Box,
  Flex,
  Grid,
  Card,
  Text,
  Heading,
  Button,
  Separator,
} from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { Flame, WalletCards, Moon, Sun } from "lucide-react";

// Swiper
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Banner Images
import Banner1 from "../assets/images/Banner1.jpg";
import Banner2 from "../assets/images/Banner2.jpg";
import Banner3 from "../assets/images/Banner3.jpg";
import Logo from "../assets/images/logo.png";

const CALORIE_BREAKDOWN = [
  { label: "Breakfast", calories: 350, color: "#FF6363" },
  { label: "Lunch", calories: 600, color: "#FFB300" },
  { label: "Snacks", calories: 200, color: "#43aa8b" },
  { label: "Dinner", calories: 450, color: "#577590" },
];

const FOOD_ITEMS = [
  { emoji: "🍳", name: "Eggs", cal: 155 },
  { emoji: "🍌", name: "Banana", cal: 89 },
  { emoji: "🍚", name: "Rice", cal: 130 },
  { emoji: "🍞", name: "Bread", cal: 265 },
  { emoji: "🍗", name: "Chicken", cal: 239 },
  { emoji: "🍎", name: "Apple", cal: 52 },
  { emoji: "🥜", name: "Peanuts", cal: 567 },
  { emoji: "🍔", name: "Burger", cal: 295 },
];

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const totalCalories = CALORIE_BREAKDOWN.reduce(
    (s, i) => s + i.calories,
    0
  );
  const [dark, setDark] = React.useState(false);

  const bg = dark
    ? "#020617"
    : "radial-gradient(circle at top left,#e6f9f4,#f7efff 40%,#edf7ff 100%)";

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: bg,
        color: dark ? "#f9fafb" : "#020617",
        transition: "background 0.25s ease, color 0.25s ease",
      }}
    >
      {/* NAVBAR */}
      <Flex
        align="center"
        justify="between"
        px="5"
        py="3"
        style={{
          background: dark ? "#020617" : "#ffffff",
          borderBottom: "1px solid rgba(148,163,184,0.35)",
          boxShadow: "0 4px 14px rgba(15,23,42,0.09)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Left: Logo + Name */}
        <Flex align="center" gap="10px">
          <img
            src={Logo}
            alt="NutriSpend Logo"
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              objectFit: "cover",
            }}
          />
          <Box>
            <Text
              size="4"
              weight="bold"
              style={{ color: dark ? "#e5e7eb" : "#111827" }}
            >
              NutriSpend
            </Text>
            <Text
              size="1"
              style={{ color: dark ? "#9ca3af" : "#6b7280" }}
            >
              Track Calories & Expenses
            </Text>
          </Box>
        </Flex>

        {/* Right: Buttons + Theme toggle */}
        <Flex align="center" gap="8px">
          <Button
            size="2"
            onClick={() => navigate("/calories")}
            style={{
              borderRadius: 999,
              paddingInline: 14,
              background: "#16a34a",
              color: "white",
              fontWeight: 600,
            }}
          >
            Calories
          </Button>

          <Button
            size="2"
            onClick={() => navigate("/expenses")}
            style={{
              borderRadius: 999,
              paddingInline: 14,
              background: "#4f46e5",
              color: "white",
              fontWeight: 600,
            }}
          >
            Expenses
          </Button>

          <Button
            size="1"
            variant="soft"
            onClick={() => setDark((v) => !v)}
            style={{
              borderRadius: "999px",
              width: 34,
              height: 34,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </Flex>
      </Flex>

      {/* MAIN CONTENT */}
      <Box
        px="4"
        py="5"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
        }}
      >
        {/* Banner Carousel */}
        <Box mb="6">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 2800 }}
            loop
            pagination={{ clickable: true }}
            style={{
              height: 260,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: dark
                ? "0 12px 32px rgba(15,23,42,0.6)"
                : "0 12px 32px rgba(15,23,42,0.14)",
            }}
          >
            {[Banner1, Banner2, Banner3].map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img}
                  alt="Banner"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* BIG ACTION BUTTONS BELOW BANNER */}
        <Flex
          gap="14px"
          justify="center"
          mb="24px"
          wrap="wrap"
        >
          <Button
            size="4"
            onClick={() => navigate("/calories")}
            style={{
              background: "#16a34a",
              color: "white",
              fontWeight: 600,
              borderRadius: 16,
              paddingInline: 26,
              minWidth: 180,
              height: 50,
            }}
          >
            <Flame size={22} style={{ marginRight: 8 }} /> Calories
          </Button>

          <Button
            size="4"
            onClick={() => navigate("/expenses")}
            style={{
              background: "#4f46e5",
              color: "white",
              fontWeight: 600,
              borderRadius: 16,
              paddingInline: 26,
              minWidth: 180,
              height: 50,
            }}
          >
            <WalletCards size={22} style={{ marginRight: 8 }} /> Expenses
          </Button>
        </Flex>

        <Separator my="4" />

        {/* Calorie Breakdown */}
        <Heading
          size="4"
          mb="3"
          style={{ color: dark ? "#e5e7eb" : "#111827" }}
        >
          🍽️ Daily Calorie Breakdown
        </Heading>

        <Card
          style={{
            borderRadius: 20,
            padding: 20,
            background: dark ? "#020617" : "#ffffff",
            boxShadow: "0 6px 16px rgba(15,23,42,0.12)",
          }}
        >
          {CALORIE_BREAKDOWN.map((i) => (
            <Box key={i.label} style={{ marginBottom: 18 }}>
              <Flex justify="between" mb="1">
                <Text
                  weight="bold"
                  style={{ color: dark ? "#e5e7eb" : "#1f2933" }}
                >
                  {i.label}
                </Text>
                <Text color="gray">{i.calories} cal</Text>
              </Flex>
              <Box
                style={{
                  height: 11,
                  width: "100%",
                  borderRadius: 999,
                  background: dark ? "#111827" : "#e5e7eb",
                  overflow: "hidden",
                }}
              >
                <Box
                  style={{
                    width: `${(i.calories / totalCalories) * 100}%`,
                    height: "100%",
                    backgroundColor: i.color,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Card>

        <Separator my="5" />

        {/* Food Cards */}
        <Heading
          size="4"
          mb="3"
          style={{ color: dark ? "#e5e7eb" : "#111827" }}
        >
          🍔 Food Calories (per 100g)
        </Heading>

        <Grid
          columns={{ initial: "2", sm: "3", md: "4" }}
          gap="4"
        >
          {FOOD_ITEMS.map((i) => (
            <Card
              key={i.name}
              style={{
                padding: "18px 12px",
                borderRadius: 18,
                textAlign: "center",
                background: dark ? "#020617" : "#ffffff",
                boxShadow: dark
                  ? "0 6px 14px rgba(15,23,42,0.6)"
                  : "0 6px 14px rgba(15,23,42,0.08)",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0px)")
              }
            >
              <Text size="7">{i.emoji}</Text>
              <Text
                weight="bold"
                style={{ marginTop: 8, color: dark ? "#e5e7eb" : "#111827" }}
              >
                {i.name}
              </Text>
              <Text color="gray">{i.cal} cal</Text>
            </Card>
          ))}
        </Grid>

        {/* Tip Box */}
        <Card
          style={{
            marginTop: 28,
            padding: 18,
            borderRadius: 18,
            background: dark ? "#022c22" : "#dcfce7",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          🌱 Small steps → Big progress. Track daily to improve both{" "}
          <b>health</b> & <b>spending</b>! 💸
        </Card>
      </Box>
    </Box>
  );
};

export default HomeScreen;
