from django.conf.urls import url, include

from rest_framework_nested import routers

from todo.api import views

router = routers.SimpleRouter()
router.register(r'projects', views.ProjectViewSet)

tasks_router = routers.NestedSimpleRouter(router, r'projects', lookup='project')
tasks_router.register(r'tasks', views.TaskViewSet)
tasks_router.register(r'sprints', views.SprintViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^', include(tasks_router.urls)),
]
