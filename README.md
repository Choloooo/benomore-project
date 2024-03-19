# project-management-sysytem
project management solution


## Project Manager API Documentation

### Overview

The Project Manager API allows users to interact with the application programmatically, enabling integration with other systems and automation of tasks.

### Base URL

The base URL for all API endpoints is: `http://127.0.0.1:8000/api`

### Endpoints

#### 1. Projects

- **GET /projects/**
  - Description: Retrieve a list of all projects.
  - Response:
    ```json
    [
      {
        "id": 1,
        "name": "Project 1",
        "description": "Description of Project 1",
        "status": "ongoing"
      },
      {
        "id": 2,
        "name": "Project 2",
        "description": "Description of Project 2",
        "status": "completed"
      }
    ]
    ```

- **POST /projects/**
  - Description: Create a new project.
  - Request Body:
    ```json
    {
      "name": "New Project",
      "description": "Description of the new project",
      "status": "ongoing"
    }
    ```
  - Response:
    ```json
    {
      "id": 3,
      "name": "New Project",
      "description": "Description of the new project",
      "status": "ongoing"
    }
    ```

- **GET /projects/{project_id}/**
  - Description: Retrieve details of a specific project.
  - Response:
    ```json
    {
      "id": 1,
      "name": "Project 1",
      "description": "Description of Project 1",
      "status": "ongoing"
    }
    ```

- **PUT /projects/{project_id}/**
  - Description: Update details of a specific project.
  - Request Body:
    ```json
    {
      "name": "Updated Project Name",
      "description": "Updated description of the project",
      "status": "completed"
    }
    ```
  - Response:
    ```json
    {
      "id": 1,
      "name": "Updated Project Name",
      "description": "Updated description of the project",
      "status": "completed"
    }
    ```

- **DELETE /projects/{project_id}/**
  - Description: Delete a specific project.
  - Response: HTTP 204 No Content

#### 2. Tasks

- **GET /projects/{project_id}/tasks/**
  - Description: Retrieve a list of all tasks within a project.
  - Response:
    ```json
    [
      {
        "id": 1,
        "name": "Task 1",
        "due_date": "2024-03-21",
        "total_tasks": 5,
        "status": "ongoing"
      },
      {
        "id": 2,
        "name": "Task 2",
        "due_date": "2024-03-25",
        "total_tasks": 10,
        "status": "completed"
      }
    ]
    ```

- **POST /projects/{project_id}/tasks/**
  - Description: Create a new task within a project.
  - Request Body:
    ```json
    {
      "name": "New Task",
      "due_date": "2024-03-28",
      "total_tasks": 8,
      "status": "ongoing"
    }
    ```
  - Response:
    ```json
    {
      "id": 3,
      "name": "New Task",
      "due_date": "2024-03-28",
      "total_tasks": 8,
      "status": "ongoing"
    }
    ```

- **GET /projects/{project_id}/tasks/{task_id}/**
  - Description: Retrieve details of a specific task within a project.
  - Response:
    ```json
    {
      "id": 1,
      "name": "Task 1",
      "due_date": "2024-03-21",
      "total_tasks": 5,
      "status": "ongoing"
    }
    ```

- **PUT /projects/{project_id}/tasks/{task_id}/**
  - Description: Update details of a specific task within a project.
  - Request Body:
    ```json
    {
      "name": "Updated Task Name",
      "due_date": "2024-03-30",
      "total_tasks": 6,
      "status": "completed"
    }
    ```
  - Response:
    ```json
    {
      "id": 1,
      "name": "Updated Task Name",
      "due_date": "2024-03-30",
      "total_tasks": 6,
      "status": "completed"
    }
    ```

- **DELETE /projects/{project_id}/tasks/{task_id}/**
  - Description: Delete a specific task within a project.
  - Response: HTTP 204 No Content
