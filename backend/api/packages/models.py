from django.db import models
from api.destinations.models import Destination
from api.categories.models import Category

class TourPackage(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='packages')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='packages')
    duration_nights = models.PositiveIntegerField(default=1)
    duration_days = models.PositiveIntegerField(default=2)
    location_summary = models.CharField(max_length=255)
    price_per_person = models.DecimalField(max_digits=10, decimal_places=2)
    double_sharing = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    triple_sharing = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    rating = models.FloatField(default=4.5)
    reviews_count = models.PositiveIntegerField(default=10)
    badge_text = models.CharField(max_length=50, blank=True, null=True)
    image_url = models.TextField()
    gallery = models.JSONField(default=list, blank=True)
    tour_overview = models.TextField(blank=True, null=True)
    cancellation_policy = models.TextField(blank=True, null=True)
    upcoming_departures = models.JSONField(default=list, blank=True)
    day_wise_itinerary = models.JSONField(default=list, blank=True)
    highlights = models.JSONField(default=list, blank=True)
    inclusions = models.JSONField(default=list, blank=True)
    exclusions = models.JSONField(default=list, blank=True)
    is_bestseller = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ItineraryItem(models.Model):
    package = models.ForeignKey(TourPackage, on_delete=models.CASCADE, related_name='itinerary')
    day_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()

    class Meta:
        ordering = ['day_number']

    def __str__(self):
        return f"Day {self.day_number}: {self.title}"


