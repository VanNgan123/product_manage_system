from django.db.models import QuerySet


def parse_boolean(value):
    if value is None:
        return None

    value = str(value).strip().lower()

    if value in {"true", "1", "yes", "on"}:
        return True

    if value in {"false", "0", "no", "off"}:
        return False

    return None


def filter_categories(queryset: QuerySet, query_params) -> QuerySet:
    name = query_params.get("name")
    is_active = parse_boolean(query_params.get("is_active"))
    ordering = query_params.get("ordering")

    if name:
        queryset = queryset.filter(name__icontains=name.strip())

    if is_active is not None:
        queryset = queryset.filter(is_active=is_active)

    allowed_ordering_fields = {
        "id",
        "-id",
        "name",
        "-name",
        "created_at",
        "-created_at",
        "updated_at",
        "-updated_at",
    }

    if ordering in allowed_ordering_fields:
        queryset = queryset.order_by(ordering)

    return queryset


def filter_products(queryset: QuerySet, query_params) -> QuerySet:
    name = query_params.get("name")
    sku = query_params.get("sku")
    category = query_params.get("category")
    category_name = query_params.get("category_name")

    min_price = query_params.get("min_price")
    max_price = query_params.get("max_price")

    min_quantity = query_params.get("min_quantity")
    max_quantity = query_params.get("max_quantity")

    is_active = parse_boolean(query_params.get("is_active"))
    ordering = query_params.get("ordering")

    if name:
        queryset = queryset.filter(name__icontains=name.strip())

    if sku:
        queryset = queryset.filter(sku__icontains=sku.strip())

    if category:
        queryset = queryset.filter(category_id=category)

    if category_name:
        queryset = queryset.filter(
            category__name__icontains=category_name.strip()
        )

    if min_price:
        queryset = queryset.filter(price__gte=min_price)

    if max_price:
        queryset = queryset.filter(price__lte=max_price)

    if min_quantity:
        queryset = queryset.filter(quantity__gte=min_quantity)

    if max_quantity:
        queryset = queryset.filter(quantity__lte=max_quantity)

    if is_active is not None:
        queryset = queryset.filter(is_active=is_active)

    allowed_ordering_fields = {
        "id",
        "-id",
        "name",
        "-name",
        "price",
        "-price",
        "quantity",
        "-quantity",
        "created_at",
        "-created_at",
        "updated_at",
        "-updated_at",
    }

    if ordering in allowed_ordering_fields:
        queryset = queryset.order_by(ordering)

    return queryset