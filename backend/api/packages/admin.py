from django.contrib import admin
from .models import TourPackage, ItineraryItem

class ItineraryItemInline(admin.TabularInline):
    model = ItineraryItem
    extra = 1

@admin.register(TourPackage)
class TourPackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'destination', 'category', 'price_per_person', 'is_bestseller', 'is_active')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ItineraryItemInline]
