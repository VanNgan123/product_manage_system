import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h2>PMS</h2>
                <span>Product Manager</span>
            </div>

            <nav className="sidebar-menu">
                <Link
                    to="/dashboard"
                    className={
                        location.pathname === "/dashboard"
                            ? "menu-link active"
                            : "menu-link"
                    }
                >
                    Dashboard
                </Link>

                <Link
                    to="/products"
                    className={
                        location.pathname.includes("/products")
                            ? "menu-link active"
                            : "menu-link"
                    }
                >
                    Products
                </Link>

                <Link
                    to="/categories"
                    className={
                        location.pathname.includes("/categories")
                            ? "menu-link active"
                            : "menu-link"
                    }
                >
                    Categories
                </Link>
            </nav>
        </aside>
    );
}

export default Sidebar;
