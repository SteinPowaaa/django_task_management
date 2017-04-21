from django.conf.urls import url, include

from rest_framework_nested import routers

from todo.api import views

router = routers.SimpleRouter()
router.register(r'projects', views.ProjectViewSet)

tasks_router = routers.NestedSimpleRouter(router, r'projects', lookup='project')
tasks_router.register(r'tasks', views.TaskViewSet)
tasks_router.register(r'sprints', views.SprintViewSet)

comments_router = routers.NestedSimpleRouter(tasks_router, r'tasks', lookup='task')
comments_router.register(r'comments', views.CommentViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^', include(tasks_router.urls)),
    url(r'^', include(comments_router.urls)),
    url(r'^projects/(?P<project_pk>[^/.]+)/tasks/(?P<task_pk>[^/.]+)/comments/(?P<pk>[^/.]+)/attachment/$',
        views.upload_attachment, name='comment-attachment')
]
