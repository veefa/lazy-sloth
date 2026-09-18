import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home.tsx";
import Navbar from "./components/Navbar.tsx";
import LazySchedulePage from "./pages/LazySchedulePage.tsx";
import ProductivityPage from "./pages/ProductivityPage.tsx";
import TasksManager from "./pages/TaskManager.tsx";
import CalendarPage from "./pages/CalendarPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lazy-schedule" element={<LazySchedulePage />} />
          <Route path="/productivity" element={<ProductivityPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tasks-manager" element={<TasksManager />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
