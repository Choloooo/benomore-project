

// Define the function to show the task table
function showTaskTable() {
    $("#task-list").show(); // Show the task table
}

// Define the function to load project status options
function loadProjectStatusOptions() {
    // Send AJAX request to fetch project statuses
    $.get("/project_statuses/", function(data) {
        // Clear existing options
        $("#project-status").empty(); // Change ID here to match the HTML ID
        // Add default option
        $("#project-status").append("<option value=''>All</option>"); // Change ID here to match the HTML ID
        // Add options for each status
        data.forEach(function(status) {
            $("#project-status").append(
                "<option value='" +
                status.value +
                "'>" +
                status.label +
                "</option>"
            );
        });
    });
}

// Call loadProjectStatusOptions() function to populate project statuses dropdown
loadProjectStatusOptions();

// Define the function to add filter tags
function addFilterTag(filterName) {
    // Create a new tag element with filter name and close button
    var tag = $("<span class='filter-tag'></span>")
        .text(filterName)
        .append("<button class='filter-tag-close'>x</button>");

    // Add click event listener to remove the tag when close button is clicked
    tag.find(".filter-tag-close").click(function() {
        tag.remove(); // Remove the tag element
        $("#status-filter").val(""); // Clear the corresponding filter
        loadProjects(); // Reload projects without the filter
    });

    // Append the tag to the filter container
    $("#filter-container").append(tag);
}

// Start of document ready function
$(document).ready(function() {
    // Function to get CSRF token from cookies
    function getCSRFToken() {
        var cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Check if the cookie name matches the CSRF cookie name
                if (
                    cookie.substring(0, "csrftoken".length + 1) ===
                    "csrftoken" + "="
                ) {
                    // Extract the CSRF token
                    cookieValue = decodeURIComponent(
                        cookie.substring("csrftoken".length + 1)
                    );
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Set up jQuery AJAX to include CSRF token in headers
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (
                !(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))
            ) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCSRFToken());
            }
        },
    });

    // Function to hide success messages
    function hideSuccessMessages() {
        $("#project-success-modal").hide();
        $("#task-success-modal").hide();
    }

    // Function to hide no projects error message
    function hideNoProjectsError() {
        $("#no-projects-error").hide();
    }

    // Function to load tasks for the selected project
    function loadTasksForProject(projectId) {
        // Clear existing tasks
        $("#task-list").empty();

        // Send AJAX request to fetch tasks for the selected project
        $.get("/projects/" + projectId + "/tasks/", function(data) {
            console.log(data);
            if (Array.isArray(data)) {
                // If tasks are retrieved successfully, populate the task list
                if (data.length > 0) {
                    data.forEach(function(task) {
                        $("#task-list").append(
                            "<tr>" +
                            "<td>" +
                            task.name +
                            "</td>" +
                            "<td>" +
                            task.due_in +
                            "</td>" +
                            "<td>" +
                            task.total_tasks +
                            "</td>" +
                            "<td>" +
                            task.status +
                            "</td>" +
                            "<td>Members</td>" +
                            "</tr>"
                        );
                    });
                } else {
                    // If no tasks are assigned to the project, display a message
                    $("#task-list").html(
                        "<tr><td colspan='5'>No tasks assigned to this project.</td></tr>"
                    );
                }
            } else {
                console.error("Unexpected response format:", data);
            }
        }).fail(function(xhr, textStatus, errorThrown) {
            console.error("Error fetching tasks:", errorThrown);
        });
    }

    // Function to load projects from the backend
    function loadProjects() {
        var status = $("#status-filter").val();
        var search = $("#search-input").val();

        // Send GET request to the backend with the search query included
        $.get(
            "/search_projects/", // Ensure that this URL matches the endpoint in your Django URLs configuration
            { query: search, status: status }, // Include the status parameter in the request
            function(data) {
                $("#project-list").empty();
                if (data.length === 0) {
                    $("#no-projects-error").show();
                } else {
                    $("#no-projects-error").hide();
                    $("#task-project").empty(); // Clear existing options in the select element
                    data.forEach(function(project) {
                        var projectItem = $(
                            "<tr class='project-item' data-id='" +
                            project.id +
                            "'>" +
                            "<td><a href='#' class='project-name-link' data-project-id='" +
                            project.id +
                            "'>" +
                            project.name +
                            "</a></td>" +
                            "<td><select class='editable'>" +
                            "<option value='ongoing'>Ongoing</option>" +
                            "<option value='completed'>Completed</option>" +
                            "</select></td>" +
                            "<td><span class='editable'>" +
                            project.description +
                            "</span></td>" +
                            "<td><button class='edit-project-btn'>Edit</button><button class='save-project-btn' style='display: none;'>Save</button></td>" +
                            "<td><button class='delete-project-btn'>Delete</button></td>" +
                            "</tr>"
                        );

                        // Add a click event listener to the project name link
                        projectItem
                            .find(".project-name-link")
                            .click(function(event) {
                                event.preventDefault(); // Prevent default link behavior
                                var projectId = $(this).data("project-id");
                                loadTasksForProject(projectId);
                                showTaskTable(); // Show the task table when a project is selected
                            });

                        projectItem.find("select").val(project.status); // Set the selected value for the dropdown

                        $("#project-list").append(projectItem);

                        // Add project as an option to the task project select element
                        $("#task-project").append(
                            $("<option></option>")
                            .attr("value", project.id)
                            .text(project.name)
                        );
                    });
                }
            }
        );
    }

    // Function to load tasks from the backend
    function loadTasks() {
        $.get("/tasks/", function(data) {
            $("#task-list").empty();
            data.forEach(function(task) {
                var editButton = "<button class='edit-task-btn'>Edit</button>";
                var deleteButton =
                    "<button class='delete-task-btn'>Delete</button>";

                var buttonsCell = $("<td>").append(editButton, deleteButton);

                // Ensure that the task ID is included as a data attribute
                var taskRow = $("<tr>")
                    .attr("data-id", task.id)
                    .append(
                        "<td>" + task.name + "</td>",
                        "<td>" + task.due_in + "</td>",
                        "<td>" + task.total_tasks + "</td>",
                        "<td>" + task.status + "</td>",
                        "<td>Members</td>",
                        buttonsCell
                    );

                $("#task-list").append(taskRow);
            });
        });
    }

    // Submit project creation form
    $("#project-form").submit(function(event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.post("/projects/", formData, function(data) {
            loadProjects(); // Reload projects after creating a new one
            $("#project-form")[0].reset(); // Clear the form
            $("#project-success-message").text("Project created successfully!");
            $("#project-success-modal").show(); // Show success modal
        });
    });

    // Submit task creation form
    $("#task-form").submit(function(event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.post("/tasks/", formData, function(data) {
            loadTasks(); // Reload tasks after creating a new one
            $("#task-form")[0].reset(); // Clear the form
            $("#task-success-message").text("Task created successfully!");
            $("#task-success-modal").show(); // Show success modal
        });
    });

    // Function to handle search
    function handleSearch() {
        $("#status-filter").val(""); // Clear the status filter when searching
        $("#filter-container").empty(); // Remove filter tags
        loadProjects(); // Reload projects when searching
    }

    // Event listener for Enter key press in the search input field
    $("#search-input").on("keydown", function(event) {
        if (event.key === "Enter") {
            handleSearch(); // Call the function to handle search
        }
    });

    // Click event listener for search button
    $("#search-button").click(function() {
        handleSearch(); // Call the function to handle search
    });

    // Click event listener for clear button
    $("#clear-button").click(function() {
        $("#search-input").val(""); // Clear the search input
        $("#status-filter").val(""); // Clear the status filter
        $("#filter-container").empty(); // Remove filter tags
        loadProjects(); // Reload projects with cleared search and filter
    });

    // Change event listener for status filter
    $("#status-filter").change(function() {
        var selectedOption = $("#status-filter option:selected").text();
        addFilterTag(selectedOption);
        loadProjects(); // Reload projects when the status filter changes
    });

    // Event listener for closing modals
    $(".close").click(function() {
        $(this).closest(".modal").hide();
    });

    // OK button event listener for project success modal
    $("#project-ok-btn").click(function() {
        $("#project-success-modal").hide();
    });

    // OK button event listener for task success modal
    $("#task-ok-btn").click(function() {
        $("#task-success-modal").hide();
    });

    // Load tasks when the page loads
    hideSuccessMessages();
    hideNoProjectsError();
    loadTasks();
});

// Click event listener for Edit button
$(document).on("click", ".edit-project-btn", function() {
    var row = $(this).closest("tr");
    row.find(".editable").attr("contenteditable", "true");
    row.find(".edit-project-btn").hide();
    row.find(".save-project-btn").show();
});

// Click event listener for Delete button
$(document).on("click", ".delete-project-btn", function() {
    var row = $(this).closest("tr");
    var projectId = row.attr("data-id");
    if (confirm("Are you sure you want to delete this project?")) {
        $.ajax({
            url: "/projects/" + projectId + "/",
            type: "DELETE",
            success: function() {
                row.remove();
                $("#project-success-message").text(
                    "Project deleted successfully!"
                );
                $("#project-success-modal").show(); // Show success modal
            },
        });
    }
});

// Click event listener for Save button
$(document).on("click", ".save-project-btn", function() {
    var row = $(this).closest("tr");
    var projectId = row.attr("data-id");
    var name = row.find("td:eq(0) ").text();
    var status = row.find("td:eq(1) select").val(); // Get selected value from the dropdown
    var description = row.find("td:eq(2) .editable").text();

    // Send request to update project
    $.ajax({
        url: "/projects/" + projectId + "/",
        type: "PUT",
        data: {
            name: name,
            status: status,
            description: description,
        },
        success: function() {
            row.find(".editable").removeAttr("contenteditable");
            row.find(".edit-project-btn").show();
            row.find(".save-project-btn").hide();
            $("#project-success-message").text("Project updated successfully!");
            $("#project-success-modal").show(); // Show success modal
        },
    });
});

// Click event listener for Edit button for tasks
$(document).on("click", ".edit-task-btn", function() {
    var row = $(this).closest("tr");
    row
        .find(".editable")
        .attr("contenteditable", "true")
        .addClass("editing");
    row.find(".edit-task-btn").hide();
    row.find(".save-task-btn").show();
});

// Click event listener for Delete button for tasks
$(document).on("click", ".delete-task-btn", function() {
    var row = $(this).closest("tr");
    var taskId = row.attr("data-id");
    if (confirm("Are you sure you want to delete this task?")) {
        $.ajax({
            url: "/tasks/" + taskId + "/", // Adjust the URL according to your backend endpoint for deleting tasks
            type: "DELETE",
            success: function() {
                row.remove();
                $("#task-success-message").text("Task deleted successfully!");
                $("#task-success-modal").show(); // Show success modal
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error("Error deleting task:", errorThrown);
            },
        });
    }
});

// Click event listener for Edit button for tasks
$(document).on("click", ".edit-task-btn", function() {
    var row = $(this).closest("tr");
    row
        .find(".editable")
        .attr("contenteditable", "true")
        .addClass("editing");
    row.find(".edit-task-btn").hide();
    // Dynamically add the Save button
    row
        .find("td:last")
        .append("<button class='save-task-btn'>Save</button>");
});

// Click event listener for Save button for tasks
$(document).on("click", ".save-task-btn", function() {
    var row = $(this).closest("tr");
    var taskId = row.attr("data-id");
    var name = row.find("td:eq(0)").text();
    var dueIn = row.find("td:eq(1)").text();
    var totalTasks = row.find("td:eq(2)").text();
    var status = row.find("td:eq(3)").text();

    // Send request to update task
    $.ajax({
        url: "/tasks/" + taskId + "/", // Adjust the URL according to your backend endpoint for updating tasks
        type: "PUT",
        data: {
            name: name,
            due_in: dueIn,
            total_tasks: totalTasks,
            status: status,
        },
        success: function() {
            row
                .find(".editable.editing")
                .removeAttr("contenteditable")
                .removeClass("editing");
            row
                .find(".save-task-btn")
                .text("Edit")
                .removeClass("save-task-btn")
                .addClass("edit-task-btn");
            $("#task-success-message").text("Task updated successfully!");
            $("#task-success-modal").show(); // Show success modal
        },
        error: function(xhr, textStatus, errorThrown) {
            console.error("Error updating task:", errorThrown);
        },
    });
});
function toggleOffcanvasMenu() {
  var offcanvasMenu = document.getElementById('offcanvas-menu');
  offcanvasMenu.classList.toggle('show');
  console.log("Offcanvas menu toggled");
}



