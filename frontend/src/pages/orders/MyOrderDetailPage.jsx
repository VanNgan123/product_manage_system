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
        </div>
    );
}

export default MyOrderDetailPage;

