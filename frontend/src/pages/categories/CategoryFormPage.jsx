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

    return (
        <div>
            <h1>{isEditMode ? "Cập nhật danh mục" : "Thêm danh mục"}</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên danh mục</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Mô tả</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                        />
                        Hoạt động
                    </label>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu"}
                </button>
            </form>
        </div>
    );
}

export default CategoryFormPage;
