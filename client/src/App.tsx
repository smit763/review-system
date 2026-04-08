import "./index.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminHome from "./pages/AdminHome";
import AddReview from "./pages/AddReview";
import ProductDetail from "./pages/ProductDetail";
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <Routes>
      <Route element={<AuthRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<AdminRoutes />}>
        <Route path="/admin/reviews" element={<AdminHome />} />
      </Route>
      <Route path="/" element={<Home />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/product/:productId/add-review" element={<AddReview />} />
    </Routes>
  );
}

export default App;
