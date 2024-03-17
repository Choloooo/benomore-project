# tasks/views.py
from django.shortcuts import render
from rest_framework import generics
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.db.models import Q
from .models import Task, Project
from .serializers import TaskSerializer, ProjectSerializer
import logging

class TaskListCreateAPIView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return JsonResponse({"message": "Task deleted successfully"}, status=204)

class ProjectListCreateAPIView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    def get_queryset(self):
        queryset = Project.objects.all()
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset

class ProjectRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return JsonResponse({"message": "Project deleted successfully"}, status=204)


    
class TaskUpdateAPIView(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class ProjectUpdateAPIView(generics.UpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

@require_GET
def search_projects(request):
    search_query = request.GET.get('query')
    status = request.GET.get('status')  # Get the project status from the query parameters
    if search_query:
        projects = Project.objects.filter(Q(name__icontains=search_query) | Q(description__icontains=search_query))
        if status:  # Filter projects by status if status parameter is provided
            projects = projects.filter(status=status)
    else:
        if status:  # Filter projects by status if status parameter is provided
            projects = Project.objects.filter(status=status)
        else:
            projects = Project.objects.all()
    serialized_projects = ProjectSerializer(projects, many=True)  # Serialize projects with ProjectSerializer
    return JsonResponse(serialized_projects.data, safe=False)

def index(request):
    tasks = Task.objects.all()
    projects = Project.objects.all()
    
    return render(request, 'index.html', {'tasks': tasks, 'projects': projects,})

def project_statuses(request):
    # Fetch the distinct status values from the Project model
    statuses = Project.STATUS_CHOICES
    # Format the data as a list of dictionaries with 'value' and 'label' keys
    status_data = [{'value': status[0], 'label': status[1]} for status in statuses]
    return JsonResponse(status_data, safe=False)


class TasksByProjectAPIView(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        
        return Task.objects.filter(project_id=project_id)
    
    
