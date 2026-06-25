import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cartApi } from "../../api/cartApi";
import { productApi } from "../../api/productApi";

const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value || 0));
};

function ProductDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await productApi.getById(id);
                setProduct(response.data.data);
            } catch {
                setError("Không thể tải chi tiết sản phẩm.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            setError("");
            setNotice("");
            await cartApi.addItem({ product: Number(id), quantity: Number(quantity) });
            setNotice("Đã thêm sản phẩm vào giỏ hàng thành công!");
            setTimeout(() => setNotice(""), 3000);
        } catch (error) {
            setError(error.response?.data?.message || "Thêm vào giỏ hàng thất bại.");
        }
    };

    const incrementQty = () => {
        if (product && quantity < product.quantity) {
            setQuantity((q) => q + 1);
        }
    };

    const decrementQty = () => {
        if (quantity > 1) {
            setQuantity((q) => q - 1);
        }
    };

    if (loading) {
        return (
            <div className="pd-wrapper">
                <div className="loading-card">Đang tải chi tiết sản phẩm...</div>
            </div>
        );
    }

    if (error && !product) {
        return (
            <div className="pd-wrapper">
                <div className="error-alert">{error}</div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="pd-wrapper">
            {/* Breadcrumb */}
            <div className="pd-breadcrumb">
                <Link to="/">Trang chủ</Link>
                <span>/</span>
                <Link to="/products">Sản phẩm</Link>
                <span>/</span>
                <span>{product.name}</span>
            </div>

            {notice && <div className="success-alert" style={{ marginBottom: "20px" }}>{notice}</div>}
            {error && <div className="error-alert" style={{ marginBottom: "20px" }}>{error}</div>}

            <div className="pd-grid">
                {/* Product Image */}
                <div className="pd-image">
                    <img
                        src={product.image_url || "https://placehold.co/760x760/e2e8f0/94a3b8?text=Product"}
                        alt={product.name}
                    />
                </div>

                {/* Product Info */}
                <div className="pd-info">
                    <div className="pd-category">
                        {product.category_detail?.name || "Chưa phân loại"}
                    </div>

                    <h1 className="pd-title">{product.name}</h1>

                    <div className="pd-price">{formatPrice(product.price)}</div>

                    <div className="pd-stock">
                        <span className={product.quantity > 0 ? "stock in-stock" : "stock out-stock"}>
                            {product.quantity > 0 ? `Còn ${product.quantity} sản phẩm` : "Hết hàng"}
                        </span>
                    </div>

                    <p className="pd-description">
                        {product.description || "Chưa có mô tả cho sản phẩm này."}
                    </p>

                    {/* Meta Info */}
                    <div className="pd-meta">
                        <div className="pd-meta-row">
                            <span className="pd-meta-label">SKU</span>
                            <span className="pd-meta-value">{product.sku}</span>
                        </div>
                        <div className="pd-meta-row">
                            <span className="pd-meta-label">Danh mục</span>
                            <span className="pd-meta-value">{product.category_detail?.name || "-"}</span>
                        </div>
                        <div className="pd-meta-row">
                            <span className="pd-meta-label">Tình trạng</span>
                            <span className="pd-meta-value">{product.stock_status}</span>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="pd-quantity">
                        <label>Số lượng:</label>
                        <div className="pd-qty-controls">
                            <button className="pd-qty-btn" onClick={decrementQty}>−</button>
                            <span className="pd-qty-value">{quantity}</span>
                            <button className="pd-qty-btn" onClick={incrementQty}>+</button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pd-actions">
                        <button
                            className="pd-add-btn"
                            disabled={product.quantity <= 0}
                            onClick={handleAddToCart}
                        >
                            🛒 Thêm vào giỏ hàng
                        </button>
                        <button className="pd-back-btn" onClick={() => navigate("/products")}>
                            ← Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;
