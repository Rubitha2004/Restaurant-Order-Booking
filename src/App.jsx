import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './routes/ProtectedRoute'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartSidebar from './components/CartSidebar'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import AdminDashboard from './pages/AdminDashboard'
import AddFood from './pages/AddFood'
import EditFood from './pages/EditFood'

function AppLayout({ search, setSearch, category, setCategory }) {
  const location = useLocation()
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthRoute && (
        <>
          <Navbar
            searchValue={search}
            onSearchChange={setSearch}
            activeCategory={category}
            onCategoryChange={setCategory}
          />
          <CartSidebar />
        </>
      )}

      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <Home
                searchValue={search}
                activeCategory={category}
              />
            }
          />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />

          {/* Protected user routes */}
          <Route path="/cart"   element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

          {/* Protected admin routes */}
          <Route path="/admin"          element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/add-food" element={<ProtectedRoute adminOnly><AddFood /></ProtectedRoute>} />
          <Route path="/admin/edit-food/:id" element={<ProtectedRoute adminOnly><EditFood /></ProtectedRoute>} />
        </Routes>
      </main>

      {!isAuthRoute && <Footer />}
    </div>
  )
}

function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppLayout
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App