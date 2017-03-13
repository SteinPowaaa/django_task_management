import pytest

from django.urls import reverse

from rest_framework import status


class TodoTest():
    def test_get_projects(self):
        url = reverse('project-list')
