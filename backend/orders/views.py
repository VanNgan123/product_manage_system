import logging

from django.db import transaction
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from products.models import Product
from utils.responses import error_response, success_response

from .models import Cart, CartItem, Order, OrderItem
from .serializers import (
    AddCartItemSerializer,
    CartItemSerializer,
    CartSerializer,
    CheckoutSerializer,
    OrderSerializer,
    OrderStatusSerializer,
    UpdateCartItemSerializer,
)


logger = logging.getLogger(__name__)


def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


class CartView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get(self, request):
        cart = get_or_create_cart(request.user)
        return success_response(
            message="Lấy giỏ hàng thành công.",
            data=CartSerializer(cart).data,
        )


class CartItemViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = CartItem.objects.none()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        cart = get_or_create_cart(self.request.user)
        return (
            CartItem.objects.select_related("product", "product__category")
            .filter(cart=cart)
            .order_by("-id")
        )

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = AddCartItemSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Dữ liệu sản phẩm trong giỏ hàng không hợp lệ.",
                errors=serializer.errors,
            )

        cart = get_or_create_cart(request.user)
        submitted_product = serializer.validated_data["product"]
        quantity = serializer.validated_data["quantity"]
        product = Product.objects.select_for_update().get(pk=submitted_product.pk)

        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        new_quantity = quantity + (cart_item.quantity if cart_item else 0)
        if product.quantity < new_quantity:
            return error_response(message="Số lượng sản phẩm trong kho không đủ.")

        if cart_item:
            cart_item.quantity = new_quantity
            cart_item.save(update_fields=["quantity"])
        else:
            cart_item = CartItem.objects.create(
                cart=cart,
                product=product,
                quantity=quantity,
            )

        return success_response(
            message="Thêm sản phẩm vào giỏ hàng thành công.",
            data=CartItemSerializer(cart_item).data,
            status_code=status.HTTP_201_CREATED,
        )

    def partial_update(self, request, *args, **kwargs):
        cart_item = self.get_object()
        serializer = UpdateCartItemSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Dữ liệu giỏ hàng không hợp lệ.",
                errors=serializer.errors,
            )

        quantity = serializer.validated_data["quantity"]
        if cart_item.product.quantity < quantity:
            return error_response(message="Số lượng sản phẩm trong kho không đủ.")

        cart_item.quantity = quantity
        cart_item.save(update_fields=["quantity"])
        return success_response(
            message="Cập nhật giỏ hàng thành công.",
            data=CartItemSerializer(cart_item).data,
        )

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return success_response(message="Xóa sản phẩm khỏi giỏ hàng thành công.")


class CheckoutView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CheckoutSerializer

    @transaction.atomic
    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Dữ liệu checkout không hợp lệ.",
                errors=serializer.errors,
            )

        cart = get_or_create_cart(request.user)
        cart_items = list(cart.items.select_related("product"))
        if not cart_items:
            return error_response(message="Giỏ hàng đang trống.")

        products = {
            product.pk: product
            for product in Product.objects.select_for_update().filter(
                pk__in=[item.product_id for item in cart_items]
            )
        }
        total_amount = 0
        for item in cart_items:
            product = products.get(item.product_id)
            if product is None or not product.is_active:
                return error_response(
                    message=f"Sản phẩm {item.product.name} hiện không còn bán."
                )
            if product.quantity < item.quantity:
                return error_response(
                    message=f"Sản phẩm {product.name} không đủ số lượng trong kho."
                )
            total_amount += product.price * item.quantity

        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            **serializer.validated_data,
        )
        order_items = []
        for item in cart_items:
            product = products[item.product_id]
            order_items.append(
                OrderItem(
                    order=order,
                    product=product,
                    product_name=product.name,
                    price=product.price,
                    quantity=item.quantity,
                )
            )
            product.quantity -= item.quantity

        OrderItem.objects.bulk_create(order_items)
        Product.objects.bulk_update(products.values(), ["quantity"])
        cart.items.all().delete()
        logger.info("Order %s created for user %s", order.pk, request.user.pk)

        return success_response(
            message="Checkout thành công. Đơn hàng đã được tạo.",
            data=OrderSerializer(order).data,
            status_code=status.HTTP_201_CREATED,
        )


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Order.objects.none()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = (
            Order.objects.prefetch_related("items")
            .select_related("user")
            .order_by("-id")
        )
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(user=self.request.user)

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[IsAdminUser],
        url_path="status",
    )
    def update_status(self, request, pk=None):
        order = self.get_object()
        serializer = OrderStatusSerializer(order, data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Trạng thái đơn hàng không hợp lệ.",
                errors=serializer.errors,
            )

        serializer.save()
        logger.info(
            "Order %s status changed to %s by user %s",
            order.pk,
            order.status,
            request.user.pk,
        )
        return success_response(
            message="Cập nhật trạng thái đơn hàng thành công.",
            data=OrderSerializer(order).data,
        )
