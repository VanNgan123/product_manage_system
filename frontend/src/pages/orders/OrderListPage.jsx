import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../../api/orderApi";

const statusLabels = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
};

const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value || 0));
};

const formatDate = (value) => {
    return value ? new Date(value).toLocaleString("vi-VN") : "-";
};

function OrderListPage() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await orderApi.getAll({ page, page_size: 20 });
            setOrders(response.data.data || []);
            setCount(response.data.count || 0);
            setNext(response.data.next);
            setPrevious(response.data.previous);
        } catch {
            setError("Không thể tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        const timeoutId = window.setTimeout(fetchOrders, 0);
        return () => window.clearTimeout(timeoutId);
    }, [fetchOrders]);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Quản lý đơn hàng</h1>
                    <p>Theo dõi và cập nhật trạng thái đơn hàng</p>
                </div>
            </div>

            {loading && <div className="loading-card">Đang tải dữ liệu...</div>}
            {error && <div className="error-alert">{error}</div>}

            {!loading && (
                <>
                    <div className="summary-card">
                        <span>Tổng số đơn hàng</span>
                        <strong>{count}</strong>
                    </div>

                    <div className="table-card">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Người nhận</th>
                                    <th>Số điện thoại</th>
                                    <th>Địa chỉ</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày tạo</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td>{order.username}</td>
                                            <td>{order.full_name}</td>
                                            <td>{order.phone}</td>
                                            <td className="truncate">{order.address}</td>
                                            <td className="price-cell">{formatPrice(order.total_amount)}</td>
                                            <td><span className={`order-status ${order.status}`}>{statusLabels[order.status] || order.status}</span></td>
                                            <td>{formatDate(order.created_at)}</td>
                                            <td>
                                                <Link className="btn-edit" to={`/admin/orders/${order.id}`}>Chi tiết</Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="empty-row">Không có đơn hàng</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button className="page-btn" disabled={!previous} onClick={() => setPage((current) => current - 1)}>
                            Trang trước
                        </button>
                        <span className="page-number">Trang {page}</span>
                        <button className="page-btn" disabled={!next} onClick={() => setPage((current) => current + 1)}>
                            Trang sau
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default OrderListPage;
