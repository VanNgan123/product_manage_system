import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

function MyOrderDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await orderApi.getById(id);
                setOrder(response.data?.data || response.data);
            } catch {
                setError("Không thể tải chi tiết đơn hàng.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div className="loading-card" style={{ margin: "40px auto", maxWidth: "600px" }}>Đang tải chi tiết đơn hàng...</div>;
    if (error) return <div className="error-alert" style={{ margin: "24px auto", maxWidth: "600px" }}>{error}</div>;
    if (!order) return null;

    return (
        <div className="od-wrapper">
            <div className="od-header">
                <div className="od-header-left">
                    <h1>Chi tiết đơn hàng #{order.id}</h1>
                    <p style={{ color: "var(--text-secondary)" }}>
                        Đặt ngày: {new Date(order.created_at).toLocaleString("vi-VN")}
                    </p>
                </div>
                <button className="hero-btn-secondary" style={{ padding: "10px 20px" }} onClick={() => navigate("/my-orders")}>
                    ← Quay lại đơn hàng
                </button>
            </div>

            <div className="od-grid">
                {/* Column 1: Order info & Receiver info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div className="od-card">
                        <h3>Thông tin giao nhận</h3>
                        <div className="od-card-row">
                            <span className="od-card-label">Người nhận hàng</span>
                            <span className="od-card-value">{order.full_name}</span>
                        </div>
                        <div className="od-card-row">
                            <span className="od-card-label">Số điện thoại</span>
                            <span className="od-card-value">{order.phone}</span>
                        </div>
                        <div className="od-card-row">
                            <span className="od-card-label">Địa chỉ nhận hàng</span>
                            <span className="od-card-value" style={{ textAlign: "right", maxWidth: "280px" }}>
                                {order.address}
                            </span>
                        </div>
                        <div className="od-card-row">
                            <span className="od-card-label">Ghi chú đơn hàng</span>
                            <span className="od-card-value" style={{ color: order.note ? "var(--text-primary)" : "var(--text-muted)" }}>
                                {order.note || "Không có ghi chú"}
                            </span>
                        </div>
                    </div>

                    <div className="od-card">
                        <h3>Thông tin vận đơn</h3>
                        <div className="od-card-row">
                            <span className="od-card-label">Trạng thái đơn hàng</span>
                            <span className={`order-status ${order.status}`}>{statusLabels[order.status] || order.status}</span>
                        </div>
                        <div className="od-card-row" style={{ paddingTop: "16px", marginTop: "12px", borderTop: "1px dashed var(--border-color)" }}>
                            <span className="od-card-label" style={{ fontWeight: "700", fontSize: "16px", color: "var(--text-primary)" }}>
                                Tổng tiền thanh toán
                            </span>
                            <span className="od-card-value" style={{ fontSize: "20px", color: "var(--accent)", fontWeight: "800" }}>
                                {formatPrice(order.total_amount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Column 2: Items Purchased */}
                <div className="od-card" style={{ height: "fit-content" }}>
                    <h3>Sản phẩm đặt mua</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {order.items.map((item) => (
                            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid var(--border-color)" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                                        {item.product_name}
                                    </span>
                                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                        Đơn giá: {formatPrice(item.price)} x {item.quantity}
                                    </span>
                                </div>
                                <strong style={{ color: "var(--text-primary)" }}>{formatPrice(item.total_price)}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

import { Link, useParams } from "react-router-dom";

import { orderApi } from "../../api/orderApi";

function MyOrderDetailPage() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrder = async () => {
        try {
            setLoading(true);

            const response = await orderApi.getById(id);

            setOrder(response.data.data);
        } catch (err) {
            console.error(err);

            setError("Không thể tải chi tiết đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

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

    if (!order) {
        return (
            <div className="container mt-4">
                <h3>Không tìm thấy đơn hàng</h3>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Chi tiết đơn hàng #{order.id}</h2>

                <Link
                    to="/my-orders"
                    className="btn btn-secondary"
                >
                    Quay lại
                </Link>
            </div>

            <div className="card p-3 mb-4">
                <h5>Thông tin đơn hàng</h5>

                <p>
                    <strong>Mã đơn:</strong> {order.id}
                </p>

                <p>
                    <strong>Trạng thái:</strong> {order.status}
                </p>

                <p>
                    <strong>Ngày tạo:</strong>{" "}
                    {new Date(
                        order.created_at
                    ).toLocaleString()}
                </p>

                <p>
                    <strong>Người nhận:</strong>{" "}
                    {order.full_name}
                </p>

                <p>
                    <strong>Số điện thoại:</strong>{" "}
                    {order.phone}
                </p>

                <p>
                    <strong>Địa chỉ:</strong>{" "}
                    {order.address}
                </p>

                {order.note && (
                    <p>
                        <strong>Ghi chú:</strong>{" "}
                        {order.note}
                    </p>
                )}
            </div>

            <div className="card p-3">
                <h5>Sản phẩm đã mua</h5>

                <table className="table table-bordered mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>

                    <tbody>
                        {order.items?.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>

                                <td>
                                    {item.product_name}
                                </td>

                                <td>
                                    {Number(
                                        item.price
                                    ).toLocaleString()} VNĐ
                                </td>

                                <td>
                                    {item.quantity}
                                </td>

                                <td>
                                    {Number(
                                        item.total_price
                                    ).toLocaleString()} VNĐ
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-end mt-3">
                    <h4>
                        Tổng tiền:
                        {" "}
                        {Number(
                            order.total_amount
                        ).toLocaleString()} VNĐ
                    </h4>
                </div>
            </div>
        </div>
    );
}

export default MyOrderDetailPage;
