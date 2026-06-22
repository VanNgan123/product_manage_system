import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryApi } from "../../api/categoryApi";

function CategoryFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        is_active: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCategory = async () => {
        try {
            const response = await categoryApi.getById(id);
            const category = response.data.data;

            setFormData({
                name: category.name || "",
                description: category.description || "",
                is_active: category.is_active,
            });
        } catch (error) {
            setError("Không thể tải thông tin danh mục.");
        }
    };

    useEffect(() => {
        if (isEditMode) {
            fetchCategory();
        }
    }, [id]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
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

            navigate("/categories");
        } catch (error) {
            setError("Lưu danh mục thất bại.");
        } finally {
            setLoading(false);
        }
    };

    // return (
    //     <div>
    //         <h1>{isEditMode ? "Cập nhật danh mục" : "Thêm danh mục"}</h1>

    //         {error && <p style={{ color: "red" }}>{error}</p>}

    //         <form onSubmit={handleSubmit}>
    //             <div>
    //                 <label>Tên danh mục</label>
    //                 <input
    //                     name="name"
    //                     value={formData.name}
    //                     onChange={handleChange}
    //                 />
    //             </div>

    //             <div>
    //                 <label>Mô tả</label>
    //                 <textarea
    //                     name="description"
    //                     value={formData.description}
    //                     onChange={handleChange}
    //                 />
    //             </div>

    //             <div>
    //                 <label>
    //                     <input
    //                         type="checkbox"
    //                         name="is_active"
    //                         checked={formData.is_active}
    //                         onChange={handleChange}
    //                     />
    //                     Hoạt động
    //                 </label>
    //             </div>

    //             <button type="submit" disabled={loading}>
    //                 {loading ? "Đang lưu..." : "Lưu"}
    //             </button>
    //         </form>
    //     </div>
    // );

    return (
        <div className="form-page">
            <div className="form-card">
                <div className="form-header">
                    <h1>
                        {isEditMode
                            ? "Cập nhật danh mục"
                            : "Thêm danh mục"}
                    </h1>

                    <p>
                        Quản lý thông tin danh mục sản phẩm
                    </p>
                </div>

                {error && (
                    <div className="error-alert">
                        {error}
                    </div>
                )}

                <form
                    className="category-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label>Tên danh mục</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên danh mục..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mô tả</label>

                        <textarea
                            name="description"
                            rows="5"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Nhập mô tả..."
                        />
                    </div>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                        />

                        <label htmlFor="is_active">
                            Danh mục đang hoạt động
                        </label>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() =>
                                navigate("/categories")
                            }
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading
                                ? "Đang lưu..."
                                : isEditMode
                                    ? "Cập nhật"
                                    : "Tạo mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryFormPage;
