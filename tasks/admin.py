from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Task, Project

class ProjectAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description', 'status']  # Add 'id' to display in the admin interface

class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_date', 'due_in', 'total_tasks', 'completed_tasks', 'status', 'project']

admin.site.register(Project, ProjectAdmin)
admin.site.register(Task, TaskAdmin)
