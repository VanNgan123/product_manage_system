import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderApi } from "../../api/orderApi";

const statuses = ["pending", "confirmed", "shipping", "completed", "cancelled"];
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

function OrderDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchOrder = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await orderApi.getById(id);
            const payload = response.data;
            const orderData = payload.data || payload;
            setOrder(orderData);
            setStatus(orderData.status);
        } catch {
            setError("Không thể tải chi tiết đơn hàng.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const timeoutId = window.setTimeout(fetchOrder, 0);
        return () => window.clearTimeout(timeoutId);
    }, [fetchOrder]);

    const handleUpdateStatus = async () => {
        try {
            setSaving(true);
            setError("");
            const response = await orderApi.updateStatus(id, { status });
            const payload = response.data;
            const orderData = payload.data || payload;
            setOrder(orderData);
            setStatus(orderData.status);
        } catch (error) {
            setError(error.response?.data?.message || "Cập nhật trạng thái thất bại.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
            return;
        }
        try {
            setSaving(true);
            setError("");
            const response = await orderApi.updateStatus(id, { status: "cancelled" });
            const payload = response.data;
            const orderData = payload.data || payload;
            setOrder(orderData);
            setStatus(orderData.status);
        } catch (error) {
            setError(error.response?.data?.message || "Hủy đơn hàng thất bại.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading-card">Đang tải dữ liệu...</div>;
    if (error && !order) return <div className="error-alert">{error}</div>;
    if (!order) return null;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Đơn hàng #{order.id}</h1>
                    <p>Thông tin đơn hàng và sản phẩm đã mua</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate("/admin/orders")}>Quay lại</button>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <div className="detail-grid">
                <div className="info-card">
                    <h2>Thông tin nhận hàng</h2>
                    <p><strong>Username:</strong> {order.username}</p>
                    <p><strong>Người nhận:</strong> {order.full_name}</p>
                    <p><strong>Số điện thoại:</strong> {order.phone}</p>
                    <p><strong>Địa chỉ:</strong> {order.address}</p>
                    <p><strong>Ghi chú:</strong> {order.note || "-"}</p>
                    <p><strong>Tổng tiền:</strong> {formatPrice(order.total_amount)}</p>
                </div>

                <div className="info-card">
                    <h2>Cập nhật trạng thái</h2>
                    <div className="form-group" style={{ marginBottom: "16px" }}>
                        <label>Trạng thái</label>
                        <select value={status} onChange={(event) => setStatus(event.target.value)}>
                            {statuses.map((item) => (
                                <option key={item} value={item}>{statusLabels[item]}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button className="btn-primary" onClick={handleUpdateStatus} disabled={saving}>
                            {saving ? "Đang cập nhật..." : "Cập nhật trạng thái"}
                        </button>
                        {order.status !== "cancelled" && order.status !== "completed" && (
                            <button className="btn-delete" onClick={handleCancelOrder} disabled={saving}>
                                Hủy đơn hàng
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="table-card">
                <table>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Tổng dòng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.product_name}</td>
                                <td>{formatPrice(item.price)}</td>
                                <td>{item.quantity}</td>
                                <td className="price-cell">{formatPrice(item.total_price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderDetailPage;
