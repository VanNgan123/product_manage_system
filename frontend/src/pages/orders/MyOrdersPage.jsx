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

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await orderApi.getAll({ page, page_size: 20 });
            const orderList = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setOrders(orderList);
            setNext(response.data?.next || null);
            setPrevious(response.data?.previous || null);
        } catch {
            setError("Không thể tải đơn hàng của bạn.");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        const timeoutId = window.setTimeout(fetchOrders, 0);
        return () => window.clearTimeout(timeoutId);
    }, [fetchOrders]);

    return (
        <div className="orders-wrapper">
            <h1 className="orders-title">Đơn hàng của tôi</h1>
            <p className="orders-subtitle">Theo dõi lịch sử mua sắm và hành trình đơn hàng của bạn</p>

            {loading && <div className="loading-card" style={{ maxWidth: "600px", margin: "40px auto" }}>Đang tải danh sách đơn hàng...</div>}
            {error && <div className="error-alert" style={{ marginBottom: "24px" }}>{error}</div>}

            {!loading && (
                <>
                    {orders.length > 0 ? (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div className="order-card" key={order.id}>
                                    <div className="order-card-header">
                                        <div>
                                            <span className="order-card-id">Đơn hàng #{order.id}</span>
                                            <span className="order-card-date" style={{ marginLeft: "12px" }}>
                                                Ngày đặt: {new Date(order.created_at).toLocaleString("vi-VN")}
                                            </span>
                                        </div>
                                        <span className={`order-status ${order.status}`}>
                                            {statusLabels[order.status] || order.status}
                                        </span>
                                    </div>
                                    <div className="order-card-body">
                                        <div className="order-card-info">
                                            <div className="order-card-info-item">
                                                <span className="order-card-info-label">Người nhận</span>
                                                <span className="order-card-info-value">{order.full_name}</span>
                                            </div>
                                            <div className="order-card-info-item">
                                                <span className="order-card-info-label">Số điện thoại</span>
                                                <span className="order-card-info-value">{order.phone}</span>
                                            </div>
                                            <div className="order-card-info-item">
                                                <span className="order-card-info-label">Tổng tiền đơn</span>
                                                <span className="order-card-info-value price">{formatPrice(order.total_amount)}</span>
                                            </div>
                                        </div>
                                        <div className="order-card-action">
                                            <Link className="hero-btn-secondary" style={{ padding: "8px 16px", fontSize: "14px" }} to={`/my-orders/${order.id}`}>
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">📦</div>
                            <h3>Chưa có đơn hàng nào</h3>
                            <p>Bạn chưa thực hiện giao dịch đặt hàng nào tại Rainscales Shop.</p>
                            <Link to="/products" className="hero-btn-primary" style={{ display: "inline-flex" }}>
                                Mua sắm sản phẩm ngay
                            </Link>
                        </div>
                    )}

                    {orders.length > 0 && (
                        <div className="pagination" style={{ marginTop: "32px" }}>
                            <button className="page-btn" disabled={!previous} onClick={() => setPage((current) => current - 1)}>
                                Trang trước
                            </button>
                            <span className="page-number">Trang {page}</span>
                            <button className="page-btn" disabled={!next} onClick={() => setPage((current) => current + 1)}>
                                Trang sau
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default MyOrdersPage;

