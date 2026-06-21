from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Product


class ProductCategoryApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="testuser",
            password="testpass123"
        )

        self.category = Category.objects.create(
            name="Laptop",
            description="Danh muc laptop",
            is_active=True,
        )

        self.product = Product.objects.create(
            category=self.category,
            name="MacBook Air M2",
            sku="MBA-M2-001",
            description="Laptop Apple MacBook Air M2",
            price=24990000,
            quantity=20,
            is_active=True,
        )

    def test_get_categories_success(self):
        url = reverse("category-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)

    def test_get_products_success(self):
        url = reverse("product-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)

    def test_create_category_requires_authentication(self):
        url = reverse("category-list")

        response = self.client.post(
            url,
            {
                "name": "Phone",
                "description": "Danh muc dien thoai",
                "is_active": True,
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_authenticated_user_can_create_category(self):
        self.client.force_authenticate(user=self.user)

        url = reverse("category-list")

        response = self.client.post(
            url,
            {
                "name": "Phone",
                "description": "Danh muc dien thoai",
                "is_active": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["data"]["name"], "Phone")

    def test_authenticated_user_can_create_product(self):
        self.client.force_authenticate(user=self.user)

        url = reverse("product-list")

        response = self.client.post(
            url,
            {
                "category": self.category.id,
                "name": "iPhone 15 Pro Max",
                "sku": "IP15PM-001",
                "description": "Dien thoai iPhone 15 Pro Max",
                "price": "29990000",
                "quantity": 15,
                "is_active": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["data"]["sku"], "IP15PM-001")
