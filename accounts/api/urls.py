from django.conf.urls import url

from accounts.api import views


urlpatterns = [
    url(r'^login', views.login),
    url(r'^logout', views.logout)
]
