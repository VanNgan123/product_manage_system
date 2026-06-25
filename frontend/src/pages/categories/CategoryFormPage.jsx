import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryApi } from "../../api/categoryApi";

function CategoryFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [formData, setFormData] = useState({ name: "", description: "", is_active: true });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await categoryApi.getById(id);
                const category = response.data.data;
                setFormData({
                    name: category.name || "",
                    description: category.description || "",
                    is_active: Boolean(category.is_active),
                });
            } catch {
                setError("Không thể tải thông tin danh mục.");
            }
        };

        if (isEditMode) fetchCategory();
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

            if (isEditMode) {
                await categoryApi.update(id, formData);
            } else {
                await categoryApi.create(formData);
            }

            navigate("/admin/categories");
        } catch (error) {
            setError(error.response?.data?.message || "Lưu danh mục thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page">
            <div className="form-card">
                <div className="form-header">
                    <h1>{isEditMode ? "Cập nhật danh mục" : "Thêm danh mục"}</h1>
                    <p>Quản lý thông tin danh mục sản phẩm</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form className="category-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tên danh mục</label>
                        <input name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Mô tả</label>
                        <textarea name="description" rows="5" value={formData.description} onChange={handleChange} />
                    </div>

                    <label className="checkbox-group">
                        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                        Danh mục đang hoạt động
                    </label>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/admin/categories")}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Tạo mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryFormPage;
