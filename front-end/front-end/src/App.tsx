import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MoviePage from './pages/MoviePage';
import SessionsPage from './pages/SessionsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from "./pages/AdminRoute.tsx";
import AdminLayout from "./components/AdminLayout.tsx";
import AdminMovies from "./pages/AdminMovies.tsx";
import AdminSessions from "./pages/AdminSessions.tsx";
import AdminCinemaRooms from "./pages/AdminCinemaRooms.tsx";
import AdminDashboardPage from "./pages/AdminDashboard.tsx";
import SessionPage from "./pages/SessionPage.tsx";
import CartPage from "./pages/CartPage.tsx";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/sessions" element={<SessionsPage />} />
              <Route path={"/session/:id"} element={<SessionPage />}/>
              <Route path={"/cart/:id"} element={<CartPage />}/>
              <Route element={<AdminRoute />}>
                  <Route element={<AdminLayout />}>
                      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                      <Route path="/admin/movies" element={<AdminMovies />} />
                      <Route path="/admin/sessions" element={<AdminSessions/>} />
                      <Route path="/admin/cinema-rooms" element={<AdminCinemaRooms />} />
                  </Route>
              </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
