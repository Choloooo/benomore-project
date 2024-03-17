# tasks/models.py
from django.db import models

class Project(models.Model):
    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    

    def __str__(self):
        return self.name

class Task(models.Model):
    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    ]
    name = models.CharField(max_length=100)
    created_date = models.DateField()
    due_in = models.DurationField()
    total_tasks = models.IntegerField()
    completed_tasks = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')

    @property
    def progress(self):
        if self.total_tasks == 0:
            return 0
        return (self.completed_tasks / self.total_tasks) * 100

    def __str__(self):
        return self.name
    
    
