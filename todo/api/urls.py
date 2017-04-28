from django.conf.urls import url, include

from rest_framework_nested import routers

from todo.api import views

router = routers.SimpleRouter()
router.register(r'projects', views.ProjectViewSet)

projects_router = routers.NestedSimpleRouter(router, r'projects', lookup='project')
projects_router.register(r'tasks', views.TaskViewSet)
projects_router.register(r'sprints', views.SprintViewSet)

tasks_router = routers.NestedSimpleRouter(projects_router, r'tasks', lookup='task')
tasks_router.register(r'comments', views.CommentViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^', include(projects_router.urls)),
    url(r'^', include(tasks_router.urls)),
]
