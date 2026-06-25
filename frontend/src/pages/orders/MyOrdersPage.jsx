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
