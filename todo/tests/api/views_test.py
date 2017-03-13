import pytest #NOQA
import json

from django.urls import reverse
from django.test import Client

from rest_framework import status


class TestTodo:
    # @pytest.mark.django_db
    # @classmethod
    # def setup_class(self):
    #     self.c = Client()
    # # force_login(user)
    #     self.c.login(username='admin', password='password123')

    @pytest.mark.django_db
    def test_todo__get_projects(self, user, project_one, project_two):
        c = Client()
        c.login(username='admin', password='password123')
        url = reverse('project-list')
        response = c.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    @pytest.mark.django_db
    def test_todo__delete_project(self, user, project_one, project_two):
        c = Client()
        c.login(username='admin', password='password123')
        url = reverse('project-detail', args=[1])
        response = c.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    @pytest.mark.django_db
    def test_todo__edit_project(self, user, project_one, project_two):
        c = Client()
        c.login(username='admin', password='password123')
        url = reverse('project-detail', args=[1])
        data = {'id': 1, 'title': 'test_title', 'description': 'test_desc'}
        response = c.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data == data

    @pytest.mark.django_db
    def test_todo__add_project(self, user, project_one, project_two):
        c = Client()
        c.login(username='admin', password='password123')
        url = reverse('project-list')
        data = {'title': 'test_title', 'description': 'test_desc'}
        response = c.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert len(response.data) == 3

        ##################################################

    @pytest.mark.django_db
    def test_todo__get_tasks(self, user, project_one, task_one, task_two):
        c = Client()
        c.login(username='admin', password='password123')
        url = reverse('task-list', args=[1])
        response = c.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    @pytest.mark.django_db
    def test_todo__delete_task(self, user, project_one, task_one, task_two):
        c = Client()
        c.login(username='admin', password='password123')
        url = reverse('task-detail', args=[1, 1])
        response = c.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    @pytest.mark.django_db
    def test_todo__edit_task(self, user, project_one, task_one, task_two):
        c = Client()
        c.login(username='admin', password='password123')
        url = reverse('task-detail', args=[1, 1])
        data = {
            'id': 1, 'title': 'test_title',
            'project': 1, 'creator': 1
        }
        response = c.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.django_db
    def test_todo__add_task(self, user, project_one, task_one, task_two):
        c = Client()
        c.login(username='admin', password='password123')
        url = reverse('task-list', args=[1])
        data = {'title': 'test_title', 'project': 1}
        response = c.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
