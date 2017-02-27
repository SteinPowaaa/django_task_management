from django.conf.urls import url, include

from rest_framework.routers import DefaultRouter

from todo.api import views

router = DefaultRouter()
router.register(r'tasks', views.TaskViewSet)
router.register(r'projects', views.ProjectViewSet)

urlpatterns = [
    url(r'^', include(router.urls))
]
