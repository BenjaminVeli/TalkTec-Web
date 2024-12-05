from django.urls import path
from . import views

urlpatterns = [
    path('users-list/', views.UserList.as_view()),
    path('users-update/<int:pk>/', views.UserListUpdate.as_view()),
    
    path('publications-list/', views.PublicationList.as_view()),
    path('publications-delete/<int:pk>/', views.PublicationListDelete.as_view()),
    path('comments/<int:pk>/', views.PublicationCommentList.as_view()),
    
    path('users-count/', views.UserCountView.as_view()),
    path('weekly-users/', views.WeeklyUserRegistrationsView.as_view()),
    path('mounthly-publications/', views.MounthlyPublicationsView.as_view()),
    path('degree-stats/', views.DegreeStatsView.as_view()),
    path('weekly-comments/', views.WeeklyFiveComments.as_view()),
    path('five-publications-bycomments/', views.TopFivePublicationsByComments.as_view()),
    path('ten-publications-bylikes/', views.TopTenPublicationsByLikes.as_view()),    
]