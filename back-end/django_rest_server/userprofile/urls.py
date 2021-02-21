from django.urls import path
from userprofile import views

urlpatterns = [
    path('register/', views.StudentDetial.as_view()),
    path('login/', views.UserLogin.as_view()),
    path('logout/', views.UserLogout.as_view())
]
