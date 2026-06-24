import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../../api/orderApi";

function OrderListPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response =
                await orderApi.getAll();

            setOrders(
                response.data.data ||
                response.data.results ||
                []
            );
        } catch (err) {
            setError("Không tải được đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <p>Đang tải...</p>;

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Quản lý đơn hàng</h2>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Người nhận</th>
                        <th>SĐT</th>
                        <th>Địa chỉ</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.full_name}</td>
                            <td>{order.phone}</td>
                            <td>{order.address}</td>
                            <td>{order.total_amount}</td>
                            <td>{order.status}</td>

                            <td>
                                <Link
                                    to={`/admin/orders/${order.id}`}
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

export default OrderListPage;
