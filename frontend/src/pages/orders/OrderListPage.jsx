import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

    // Modal state
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalStatus, setModalStatus] = useState("");
    const [modalSaving, setModalSaving] = useState(false);
    const [modalError, setModalError] = useState("");

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await orderApi.getAll({ page, page_size: 20 });
            const payload = response.data;

            // DRF không có pagination → trả thẳng array
            // DRF có pagination → trả { count, next, previous, results }
            if (Array.isArray(payload)) {
                setOrders(payload);
                setCount(payload.length);
                setNext(null);
                setPrevious(null);
            } else {
                setOrders(payload.results || payload.data || []);
                setCount(payload.count || 0);
                setNext(payload.next || null);
                setPrevious(payload.previous || null);
            }
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

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setModalStatus(order.status);
        setModalError("");
    };

    const handleUpdateModalStatus = async () => {
        try {
            setModalSaving(true);
            setModalError("");
            const response = await orderApi.updateStatus(selectedOrder.id, { status: modalStatus });
            const payload = response.data;
            const updatedOrder = payload.data || payload;

            // Cập nhật lại trong danh sách orders hiện tại
            setOrders((prevOrders) =>
                prevOrders.map((o) => (o.id === selectedOrder.id ? { ...o, ...updatedOrder } : o))
            );
            setSelectedOrder(updatedOrder);
            alert("Cập nhật trạng thái thành công!");
        } catch (error) {
            setModalError(error.response?.data?.message || "Cập nhật trạng thái thất bại.");
        } finally {
            setModalSaving(false);
        }
    };

    const handleCancelModalOrder = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
            return;
        }
        try {
            setModalSaving(true);
            setModalError("");
            const response = await orderApi.updateStatus(selectedOrder.id, { status: "cancelled" });
            const payload = response.data;
            const updatedOrder = payload.data || payload;

            // Cập nhật lại trong danh sách orders hiện tại
            setOrders((prevOrders) =>
                prevOrders.map((o) => (o.id === selectedOrder.id ? { ...o, ...updatedOrder } : o))
            );
            setSelectedOrder(updatedOrder);
            setModalStatus("cancelled");
            alert("Hủy đơn hàng thành công!");
        } catch (error) {
            setModalError(error.response?.data?.message || "Hủy đơn hàng thất bại.");
        } finally {
            setModalSaving(false);
        }
    };

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
                                            <td>
                                                <span className={`order-status ${order.status}`}>
                                                    {statusLabels[order.status] || order.status}
                                                </span>
                                            </td>
                                            <td>{formatDate(order.created_at)}</td>
                                            <td>
                                                <button className="btn-edit" onClick={() => handleOpenModal(order)}>
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="empty-row">
                                            Không có đơn hàng
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button
                            className="page-btn"
                            disabled={!previous}
                            onClick={() => setPage((current) => current - 1)}
                        >
                            Trang trước
                        </button>
                        <span className="page-number">Trang {page}</span>
                        <button
                            className="page-btn"
                            disabled={!next}
                            onClick={() => setPage((current) => current + 1)}
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            )}

            {/* Modal chi tiết đơn hàng */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Chi tiết đơn hàng #{selectedOrder.id}</h2>
                            <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            {modalError && <div className="error-alert">{modalError}</div>}

                            <div className="modal-grid">
                                <div className="order-detail-info">
                                    <h3 className="modal-section-title">Thông tin khách hàng</h3>
                                    <p>
                                        <strong>Username:</strong> {selectedOrder.username}
                                    </p>
                                    <p>
                                        <strong>Người nhận:</strong> {selectedOrder.full_name}
                                    </p>
                                    <p>
                                        <strong>Số điện thoại:</strong> {selectedOrder.phone}
                                    </p>
                                    <p>
                                        <strong>Địa chỉ:</strong> {selectedOrder.address}
                                    </p>
                                    <p>
                                        <strong>Ghi chú:</strong> {selectedOrder.note || "-"}
                                    </p>
                                    <p>
                                        <strong>Ngày đặt hàng:</strong> {formatDate(selectedOrder.created_at)}
                                    </p>
                                    <p>
                                        <strong>Tổng giá trị:</strong>{" "}
                                        <span className="price-cell">{formatPrice(selectedOrder.total_amount)}</span>
                                    </p>
                                </div>
                                <div className="modal-status-edit">
                                    <h3 className="modal-section-title">Quản lý trạng thái</h3>
                                    <div className="form-group" style={{ marginBottom: "16px" }}>
                                        <label>Trạng thái hiện tại</label>
                                        <select
                                            value={modalStatus}
                                            onChange={(e) => setModalStatus(e.target.value)}
                                            disabled={modalSaving}
                                        >
                                            {statuses.map((statusVal) => (
                                                <option key={statusVal} value={statusVal}>
                                                    {statusLabels[statusVal] || statusVal}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                        <button
                                            className="btn-primary"
                                            onClick={handleUpdateModalStatus}
                                            disabled={modalSaving}
                                        >
                                            {modalSaving ? "Đang lưu..." : "Lưu trạng thái"}
                                        </button>
                                        {selectedOrder.status !== "cancelled" &&
                                            selectedOrder.status !== "completed" && (
                                                <button
                                                    className="btn-delete"
                                                    onClick={handleCancelModalOrder}
                                                    disabled={modalSaving}
                                                >
                                                    Hủy đơn hàng
                                                </button>
                                            )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="modal-section-title">Danh sách sản phẩm</h3>
                                <div
                                    className="table-card"
                                    style={{ boxShadow: "none", border: "1px solid var(--border-color)" }}
                                >
                                    <table style={{ minWidth: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th>Giá</th>
                                                <th>Số lượng</th>
                                                <th>Tổng dòng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                                selectedOrder.items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.product_name}</td>
                                                        <td>{formatPrice(item.price)}</td>
                                                        <td>{item.quantity}</td>
                                                        <td className="price-cell">
                                                            {formatPrice(item.total_price)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        style={{
                                                            textAlign: "center",
                                                            color: "var(--text-muted)",
                                                            padding: "16px",
                                                        }}
                                                    >
                                                        Không có sản phẩm nào
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Link to={`/admin/orders/${selectedOrder.id}`} className="btn-secondary">
                                Xem trang chi tiết
                            </Link>
                            <button className="btn-secondary" onClick={() => setSelectedOrder(null)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderListPage;
