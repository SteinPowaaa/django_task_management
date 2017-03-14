import pytest #NOQA
import json

from django.urls import reverse
from django.test import Client

from rest_framework import status


@pytest.mark.django_db
class TestTodo:
    @pytest.fixture(autouse=True)
    def setup_login(self, user):
        self.c = Client()
        self.c.force_login(user)

    def test_todo__get_projects(self, project_one, project_two):
        url = reverse('project-list')
        response = self.c.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_todo__delete_project(self, project_one):
        url = reverse('project-detail', args=[1])
        response = self.c.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_todo__edit_project(self, project_one):
        url = reverse('project-detail', args=[1])
        data = {'id': 1, 'title': 'test_title', 'description': 'test_desc'}
        response = self.c.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data == data

    def test_todo__edit_project_invalid_data(self, project_one):
        url = reverse('project-detail', args=[1])
        data = {'id': 1, 'description': 'test_desc'}
        response = self.c.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_todo__add_project(self, project_one, project_two):
        url = reverse('project-list')
        data = {'title': 'test_title', 'description': 'test_desc'}
        response = self.c.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert len(response.data) == 3

    def test_todo__add_project_invalid_data(self, project_one, project_two):
        url = reverse('project-list')
        data = {'description': 'test_desc'}
        response = self.c.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

        ############################## TASKS ##############################

    def test_todo__get_tasks(self, project_one, task_one, task_two):
        url = reverse('task-list', args=[1])
        response = self.c.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_todo__delete_task(self, project_one, task_one):
        url = reverse('task-detail', args=[1, 1])
        response = self.c.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_todo__edit_task(self, project_one, task_one):
        url = reverse('task-detail', args=[1, 1])
        data = {
            'id': 1, 'title': 'test_title',
            'project': 1, 'creator': 1
        }
        response = self.c.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_200_OK

    def test_todo__edit_task_invalid_data(self, project_one, task_one):
        url = reverse('task-detail', args=[1, 1])
        data = {
            'id': 1, 'project': 1, 'creator': 1
        }
        response = self.c.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_todo__add_task(self, project_one):
        url = reverse('task-list', args=[1])
        data = {'title': 'test_title', 'project': 1}
        response = self.c.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED

    def test_todo__add_task_invalid_data(self, project_one):
        url = reverse('task-list', args=[1])
        data = {'project': 1}
        response = self.c.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
