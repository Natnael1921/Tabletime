import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { RestaurantsPage } from "./pages/RestaurantsPage";
import { OrdersPage } from "./pages/OrdersPage";
import { PageNav } from "./components/PageNav";
import { RestaurantOrdersPage } from "./pages/RestaurantOrdersPage";
import { RestaurantMenuPage } from "./pages/RestaurantMenuPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [orders, setOrders] = useState([]); // 🔥 Centralized order state

  // Handle placing a new order
  function handlePlaceOrder(order) {
    setOrders((prev) => [...prev, order]);
  }

  // Handle accepting an order by ID
  function handleAcceptOrder(orderId) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "delivered" } : order
      )
    );
  }

  return (
    <BrowserRouter>
      <PageNav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/restaurants"
          element={
            <RestaurantsPage
              isLoggedIn={isLoggedIn}
              handlePlaceOrder={handlePlaceOrder}
            />
          }
        />
        <Route
          path="/orders"
          element={
            isLoggedIn && userRole === "user" ? (
              <OrdersPage orders={orders} />
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
            )
          }
        />
        <Route
          path="/restaurant-orders"
          element={
            isLoggedIn && userRole === "owner" ? (
              <RestaurantOrdersPage orders={orders} onAccept={handleAcceptOrder} />
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
            )
          }
        />
        <Route
          path="/restaurant-menu"
          element={
            isLoggedIn && userRole === "owner" ? (
              <RestaurantMenuPage />
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
            )
          }
        />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
      </Routes>
    </BrowserRouter>
  );
}

