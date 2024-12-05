from django.urls import path
from . import views

urlpatterns = [
    path('', views.PublicationList.as_view()),
    path('<int:pk>/', views.PublicationDetail.as_view()),
    path('my/<str:name>/', views.get_user_publications),
    path('like/<int:pk>/', views.like),
    path('likes/<str:name>/', views.get_user_likes),
    path('comments/<int:pk>/', views.CommentList.as_view()),
    path('comment/<int:pk>/', views.CommentDetail.as_view()),
    path('degree/<int:pk>/', views.FilterDegree.as_view()),
]