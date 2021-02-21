from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class UserProfileAdmin(UserAdmin):
    fieldsets = ((None, {
        'fields':
        ('no', 'username', 'password', 'class_grade', 'score', 'finished')
    }), )
    list_display = ('no', 'username', 'class_grade', 'is_superuser', 'score',
                    'finished')
    list_filter = ('is_superuser', )
