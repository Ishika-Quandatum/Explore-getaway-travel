from django.db import models

class Category(models.Model):
    DISPLAY_LABEL_CHOICES = (
        ('for_everyone', 'For Everyone'),
        ('for_solo_travelers', 'For Solo Travelers'),
        ('for_families', 'For Families'),
        ('for_groups', 'For Groups'),
        ('for_friends', 'For Friends'),
        ('for_couples', 'For Couples'),
        ('for_relaxation', 'For Relaxation'),
    )

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    image_url = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    display_label = models.CharField(max_length=30, choices=DISPLAY_LABEL_CHOICES, default='for_everyone')

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name
