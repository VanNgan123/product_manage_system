import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryApi } from "../../../api/categoryApi";
import { productApi } from "../../../api/productApi";

function AdminProductFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        category: "",
        name: "",
        sku: "",
        description: "",
        price: "",
        quantity: "",
        image_url: "",
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await categoryApi.getAll({ page_size: 100 });
            setCategories(response.data.data || []);
        };

        const fetchProduct = async () => {
            try {
                const response = await productApi.getById(id);
                const product = response.data.data;
                setFormData({
                    category: product.category || "",
                    name: product.name || "",
                    sku: product.sku || "",
                    description: product.description || "",
                    price: product.price || "",
                    quantity: product.quantity ?? "",
                    image_url: product.image_url || "",
                    is_active: Boolean(product.is_active),
                });
            } catch {
                setError("Không thể tải thông tin sản phẩm.");
            }
        };

        fetchCategories();
        if (isEditMode) fetchProduct();
    }, [id, isEditMode]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");
            const payload = {
                ...formData,
                category: Number(formData.category),
                price: String(formData.price),
                quantity: Number(formData.quantity),
            };

            if (isEditMode) {
                await productApi.update(id, payload);
            } else {
                await productApi.create(payload);
            }

            navigate("/admin/products");
        } catch (error) {
            setError(error.response?.data?.message || "Lưu sản phẩm thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page">
            <div className="form-card">
                <div className="form-header">
                    <h1>{isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</h1>
                    <p>Quản lý thông tin sản phẩm và tồn kho</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form className="product-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Danh mục</label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>SKU</label>
                            <input name="sku" value={formData.sku} onChange={handleChange} required />
                        </div>

                        <div className="form-group full-width">
                            <label>Tên sản phẩm</label>
                            <input name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Giá</label>
                            <input type="number" min="0" name="price" value={formData.price} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Số lượng</label>
                            <input type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} required />
                        </div>

                        <div className="form-group full-width">
                            <label>Ảnh sản phẩm</label>
                            <input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
                        </div>

                        {formData.image_url && (
                            <div className="image-preview-container full-width">
                                <img className="image-preview" src={formData.image_url} alt="Preview" />
                            </div>
                        )}

                        <div className="form-group full-width">
                            <label>Mô tả</label>
                            <textarea rows="5" name="description" value={formData.description} onChange={handleChange} />
                        </div>

                        <label className="checkbox-group full-width">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                            Hiển thị sản phẩm
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/admin/products")}>Hủy</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Tạo sản phẩm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminProductFormPage;
