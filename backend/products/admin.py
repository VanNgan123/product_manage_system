from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'name',
        'slug',
        'is_active',
        'created_at',
    ]
    search_fields = ['name', 'description']
    list_filter = ['is_active', 'created_at']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'name',
        'sku',
        'category',
        'price',
        'quantity',
        'is_active',
        'created_at',
    ]
    search_fields = ['name', 'sku', 'description']
    list_filter = ['category', 'is_active', 'created_at']