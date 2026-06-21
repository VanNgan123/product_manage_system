from rest_framework import status, viewsets
from rest_framework.response import Response

from .filters import filter_categories, filter_products
from .models import Category, Product
from .pagination import CategoryPagination, ProductPagination
from .permissions import IsAuthenticatedForWriteOrReadOnly
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("-id")
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedForWriteOrReadOnly]
    pagination_class = CategoryPagination

    def get_queryset(self):
        queryset = Category.objects.all().order_by("-id")

        return filter_categories(
            queryset,
            self.request.query_params
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(
                page,
                many=True
            )

            return Response(
                {
                    "message": "Lấy danh sách danh mục thành công.",
                    "count": self.paginator.page.paginator.count,
                    "next": self.paginator.get_next_link(),
                    "previous": self.paginator.get_previous_link(),
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        return Response(
            {
                "message": "Lấy danh sách danh mục thành công.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Thêm danh mục thành công.",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "message": "Dữ liệu danh mục không hợp lệ.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def retrieve(self, request, *args, **kwargs):
        category = self.get_object()
        serializer = self.get_serializer(category)

        return Response(
            {
                "message": "Lấy chi tiết danh mục thành công.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def update(self, request, *args, **kwargs):
        category = self.get_object()

        serializer = self.get_serializer(
            category,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Cập nhật danh mục thành công.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "message": "Dữ liệu danh mục không hợp lệ.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def partial_update(self, request, *args, **kwargs):
        category = self.get_object()

        serializer = self.get_serializer(
            category,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Cập nhật một phần danh mục thành công.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "message": "Dữ liệu danh mục không hợp lệ.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def destroy(self, request, *args, **kwargs):
        category = self.get_object()

        if category.products.exists():
            return Response(
                {
                    "message": (
                        "Không thể xóa danh mục vì vẫn còn "
                        "sản phẩm thuộc danh mục này."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        category.delete()

        return Response(
            {
                "message": "Xóa danh mục thành công."
            },
            status=status.HTTP_200_OK,
        )


class ProductViewSet(viewsets.ModelViewSet):
    queryset = (
        Product.objects
        .select_related("category")
        .all()
        .order_by("-id")
    )

    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedForWriteOrReadOnly]
    pagination_class = ProductPagination

    def get_queryset(self):
        queryset = (
            Product.objects
            .select_related("category")
            .all()
            .order_by("-id")
        )

        return filter_products(
            queryset,
            self.request.query_params
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(
                page,
                many=True
            )

            return Response(
                {
                    "message": "Lấy danh sách sản phẩm thành công.",
                    "count": self.paginator.page.paginator.count,
                    "next": self.paginator.get_next_link(),
                    "previous": self.paginator.get_previous_link(),
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        return Response(
            {
                "message": "Lấy danh sách sản phẩm thành công.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Thêm sản phẩm thành công.",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "message": "Dữ liệu sản phẩm không hợp lệ.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def retrieve(self, request, *args, **kwargs):
        product = self.get_object()
        serializer = self.get_serializer(product)

        return Response(
            {
                "message": "Lấy chi tiết sản phẩm thành công.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def update(self, request, *args, **kwargs):
        product = self.get_object()

        serializer = self.get_serializer(
            product,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Cập nhật sản phẩm thành công.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "message": "Dữ liệu sản phẩm không hợp lệ.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def partial_update(self, request, *args, **kwargs):
        product = self.get_object()

        serializer = self.get_serializer(
            product,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Cập nhật một phần sản phẩm thành công.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "message": "Dữ liệu sản phẩm không hợp lệ.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        product.delete()

        return Response(
            {
                "message": "Xóa sản phẩm thành công."
            },
            status=status.HTTP_200_OK,
        )