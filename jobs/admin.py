from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        'company',
        'position',
        'location',
        'status',
        'date_applied',
    )

    list_filter = ('status', 'location')

    search_fields = (
        'company',
        'position',
    )
