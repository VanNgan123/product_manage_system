from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    total_products = serializers.IntegerField(
        source='products.count',
        read_only=True
    )

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'is_active',
            'total_products',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'slug',
            'created_at',
            'updated_at',
        ]


class ProductSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(
        source='category',
        read_only=True
    )
    stock_status = serializers.CharField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'category',
            'category_detail',
            'name',
            'slug',
            'sku',
            'description',
            'price',
            'quantity',
            'image_url',
            'is_active',
            'stock_status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'slug',
            'stock_status',
            'created_at',
            'updated_at',
        ]