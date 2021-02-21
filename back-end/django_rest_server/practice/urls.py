from django.urls import path
from practice import views

urlpatterns = [
    path('student/', views.StudentAction.as_view()),
    path('teacher/', views.AdminAction.as_view()),
]
