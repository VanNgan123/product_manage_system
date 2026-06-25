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
