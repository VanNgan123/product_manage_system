import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cartApi } from "../../api/cartApi";
import { productApi } from "../../api/productApi";
// Giả sử bạn có file CSS riêng cho trang chi tiết
import "../../styles/product-detail.css";

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productApi.getById(id);
            setProduct(response.data.data);
        } catch (err) {
            setError("Không tìm thấy sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (quantity < 1) return alert("Số lượng phải lớn hơn 0");
        try {
            setAdding(true);
            await cartApi.addItem({ product: Number(id), quantity: Number(quantity) });
            alert("Đã thêm vào giỏ hàng!");
        } catch (err) {
            alert("Lỗi khi thêm vào giỏ hàng");
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <div className="detail-loading">Đang tải thông tin...</div>;
    if (error || !product) return <div className="detail-error">{error || "Sản phẩm không tồn tại"}</div>;

    return (
        <div className="detail-page-wrapper">
            <button className="btn-back" onClick={() => navigate(-1)}>← Quay lại</button>

            <div className="detail-card">
                <div className="detail-image-side">
                    <img src={product.image_url || "https://placehold.co/500x500"} alt={product.name} />
                </div>

                <div className="detail-info-side">
                    <h1>{product.name}</h1>
                    <div className="price-tag">{Number(product.price).toLocaleString()} VNĐ</div>

                    <div className="product-meta">
                        <p><span>SKU:</span> {product.sku}</p>
                        <p><span>Danh mục:</span> {product.category_name}</p>
                        <p><span>Tình trạng:</span> {product.quantity > 0 ? `Còn ${product.quantity} sản phẩm` : "Hết hàng"}</p>
                    </div>

                    <p className="description">{product.description}</p>

                    <div className="action-area">
                        <div className="qty-input">
                            <label>Số lượng:</label>
                            <input
                                type="number" min="1" max={product.quantity}
                                value={quantity} onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                        <button className="btn-add-cart" onClick={handleAddToCart} disabled={adding || product.quantity === 0}>
                            {adding ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;
