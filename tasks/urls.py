# tasks/urls.py
from django.urls import path
from . import views
urlpatterns = [
    path('tasks/', views.TaskListCreateAPIView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', views.TaskRetrieveUpdateDestroyAPIView.as_view(), name='task-detail'),
    path('search_projects/', views.search_projects, name='search_projects'),
    path('projects/', views.ProjectListCreateAPIView.as_view(), name='project-list-create'),  # Add this line
    path('projects/<int:pk>/', views.ProjectRetrieveUpdateDestroyAPIView.as_view(), name='project-detail'),  # Optional: If you have an endpoint for individual project details
    path('tasks/<int:pk>/update_status/', views.TaskUpdateAPIView.as_view(), name='task-update'),  
    path('project_statuses/', views.project_statuses, name='project_statuses'),
    path('projects/<int:pk>/update_status/', views.ProjectUpdateAPIView.as_view(), name='project-update'),  # New URL for updating project status
    path('', views.index, name='index'),
    path('projects/<int:project_id>/tasks/', views.TasksByProjectAPIView.as_view(), name='tasks-by-project'),

]