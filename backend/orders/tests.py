from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from products.models import Category, Product

from .models import CartItem, Order


class CartCheckoutOrderApiTests(APITestCase):
    def setUp(self):
        user_model = get_user_model()
        self.user = user_model.objects.create_user(
            username="buyer",
            password="testpass123",
        )
        self.other_user = user_model.objects.create_user(
            username="other",
            password="testpass123",
        )
        self.admin = user_model.objects.create_user(
            username="admin",
            password="testpass123",
            is_staff=True,
        )
        category = Category.objects.create(name="Laptop")
        self.product = Product.objects.create(
            category=category,
            name="MacBook Air",
            sku="MBA-001",
            price="1000.00",
            quantity=5,
        )
        self.client.force_authenticate(user=self.user)

    def add_to_cart(self, quantity=2):
        return self.client.post(
            reverse("cart-item-list"),
            {"product": self.product.pk, "quantity": quantity},
            format="json",
        )

    def test_add_update_and_remove_cart_item(self):
        response = self.add_to_cart()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        item_id = response.data["data"]["id"]

        response = self.add_to_cart(quantity=1)
        self.assertEqual(response.data["data"]["quantity"], 3)

        response = self.client.patch(
            reverse("cart-item-detail", args=[item_id]),
            {"quantity": 4},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["quantity"], 4)

        response = self.client.delete(reverse("cart-item-detail", args=[item_id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(CartItem.objects.filter(pk=item_id).exists())

    def test_cart_rejects_invalid_or_excess_quantity(self):
        response = self.add_to_cart(quantity="invalid")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])

        response = self.add_to_cart(quantity=6)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_checkout_creates_snapshot_decrements_stock_and_clears_cart(self):
        self.add_to_cart(quantity=2)
        response = self.client.post(
            reverse("checkout"),
            {
                "full_name": "Nguyen Van An",
                "phone": "0900000000",
                "address": "Da Nang",
                "note": "Office hours",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order = Order.objects.get(pk=response.data["data"]["id"])
        self.assertEqual(order.user, self.user)
        self.assertEqual(str(order.total_amount), "2000.00")
        self.assertEqual(order.items.get().product_name, "MacBook Air")
        self.assertFalse(CartItem.objects.filter(cart__user=self.user).exists())
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 3)

    def test_user_only_sees_own_orders_and_admin_can_update_status(self):
        own_order = Order.objects.create(
            user=self.user,
            full_name="Buyer",
            phone="1",
            address="Address",
        )
        other_order = Order.objects.create(
            user=self.other_user,
            full_name="Other",
            phone="2",
            address="Address",
        )

        response = self.client.get(reverse("order-list"))
        self.assertEqual([item["id"] for item in response.data], [own_order.pk])

        response = self.client.patch(
            reverse("order-update-status", args=[own_order.pk]),
            {"status": Order.Status.CONFIRMED},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("order-list"))
        self.assertEqual(
            {item["id"] for item in response.data},
            {own_order.pk, other_order.pk},
        )
        response = self.client.patch(
            reverse("order-update-status", args=[own_order.pk]),
            {"status": Order.Status.CONFIRMED},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        own_order.refresh_from_db()
        self.assertEqual(own_order.status, Order.Status.CONFIRMED)

    def test_cart_and_checkout_require_authentication(self):
        self.client.force_authenticate(user=None)
        self.assertEqual(
            self.client.get(reverse("cart")).status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
        self.assertEqual(
            self.client.post(reverse("checkout"), {}, format="json").status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
