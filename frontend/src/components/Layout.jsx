

// import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import "./Layout.css";

// function Layout() {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const handleLogout = () => {
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         navigate("/login");
//     };

//     return (
//         <div className="layout">
//             <aside className="sidebar">
//                 <div className="logo">
//                     <h2>PMS</h2>
//                     <span>Product Manager System</span>
//                 </div>

//                 <nav className="menu">
//                     <Link
//                         to="/products"
//                         className={
//                             location.pathname.includes("/products")
//                                 ? "menu-item active"
//                                 : "menu-item"
//                         }
//                     >
//                         📦 Sản phẩm
//                     </Link>

//                     <Link
//                         to="/categories"
//                         className={
//                             location.pathname.includes("/categories")
//                                 ? "menu-item active"
//                                 : "menu-item"
//                         }
//                     >
//                         📁 Danh mục
//                     </Link>
//                 </nav>

//                 <button
//                     className="logout-btn"
//                     onClick={handleLogout}
//                 >
//                     Đăng xuất
//                 </button>
//             </aside>

//             <div className="main">
//                 <header className="header">
//                     <h1>Product Management Dashboard</h1>
//                 </header>

//                 <main className="content">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// }

// export default Layout;
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="logo">
                    <h2>PMS</h2>
                    <span>Product Manager System</span>
                </div>

                <nav className="menu">
                    <Link
                        to="/products"
                        className={
                            location.pathname.includes("/products")
                                ? "menu-item active"
                                : "menu-item"
                        }
                    >
                        📦 Sản phẩm
                    </Link>

                    <Link
                        to="/categories"
                        className={
                            location.pathname.includes("/categories")
                                ? "menu-item active"
                                : "menu-item"
                        }
                    >
                        📁 Danh mục
                    </Link>
                </nav>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Đăng xuất
                </button>
            </aside>

            <div className="main">
                <header className="header">
                    <h1>Product Management Dashboard</h1>
                </header>

                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
