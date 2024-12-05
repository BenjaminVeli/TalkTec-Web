from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.register),
    path('login/', views.MyTokenObtainPairSerializer.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('departments/', views.DepartmentList.as_view()),
    path('<str:name>/', views.UserDetailView.as_view()),
    path('u/search/', views.search),
]