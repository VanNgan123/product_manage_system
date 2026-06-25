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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { orderApi } from "../../api/orderApi";

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await orderApi.getAll();

            setOrders(response.data.data || []);
        } catch (err) {
            console.error(err);

            setError("Không thể tải danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="container mt-4">
                <h3>Đang tải đơn hàng...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mt-4">
                <h3>Bạn chưa có đơn hàng nào</h3>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>Đơn hàng của tôi</h2>

            <table className="table table-bordered table-hover mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Tổng tiền</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>

                            <td>
                                {new Date(
                                    order.created_at
                                ).toLocaleString()}
                            </td>

                            <td>
                                {order.status}
                            </td>

                            <td>
                                {Number(
                                    order.total_amount
                                ).toLocaleString()} VNĐ
                            </td>

                            <td>
                                <Link
                                    to={`/my-orders/${order.id}`}
                                    className="btn btn-primary btn-sm"
                                >
                                    Chi tiết
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyOrdersPage;
