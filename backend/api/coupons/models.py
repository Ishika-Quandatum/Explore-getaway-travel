from django.db import models

class Coupon(models.Model):
    heading = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    offer_code = models.CharField(max_length=50, unique=True)
    image_url = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.heading} ({self.offer_code})"
