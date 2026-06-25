import { useEffect, useState } from "react";
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
