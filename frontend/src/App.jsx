import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

import ProductFormPage from "./pages/products/ProductFormPage";
import ProductListPage from "./pages/products/ProductListPage";

import CategoryFormPage from "./pages/categories/CategoryFormPage";
import CategoryListPage from "./pages/categories/CategoryListPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/products" replace />} />

                    <Route path="products" element={<ProductListPage />} />
                    <Route path="products/create" element={<ProductFormPage />} />
                    <Route path="products/:id/edit" element={<ProductFormPage />} />

                    <Route path="categories" element={<CategoryListPage />} />
                    <Route path="categories/create" element={<CategoryFormPage />} />
                    <Route path="categories/:id/edit" element={<CategoryFormPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
