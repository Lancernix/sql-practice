from django.contrib import admin
from .models import Question


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    ordering = ('id', )
    list_display = ('id', 'content')
