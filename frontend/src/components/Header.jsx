import { FaBell, FaUserCircle } from "react-icons/fa";

function Header() {
    return (
        <div className="dashboard-header">
            <div>
                <h2>Dashboard</h2>
                <p>Quản lý sản phẩm Pickleball</p>
            </div>

            <div className="header-actions">
                <FaBell size={20} />
                <FaUserCircle size={34} />
            </div>
        </div>
    );
}

export default Header;
