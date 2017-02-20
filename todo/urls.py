from django.conf.urls import url, include

from todo.views import IndexPageView

urlpatterns = [
    url(r'^$', IndexPageView.as_view()),
    url(r'^api/', include('todo.api.urls'))
]
