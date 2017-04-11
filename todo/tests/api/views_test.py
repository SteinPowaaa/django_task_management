import pytest
import json

from django.urls import reverse

from rest_framework import status


@pytest.mark.django_db
class TestProjects:
    def test_project__get_projects(self, project_default, client):
        url = reverse('project-list')
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_project__delete_project(self, project_default, client):
        url = reverse('project-detail', args=[1])
        response = client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_project__edit_project(self, project_default, client):
        url = reverse('project-detail', args=[1])
        data = {'id': 1, 'title': 'test_title', 'description': 'test_desc'}
        response = client.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data == data

    def test_project__edit_project_invalid_data(self, project_default, client):
        url = reverse('project-detail', args=[1])
        data = {'id': 1, 'description': 'test_desc'}
        response = client.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_project__add_project(self, project_default, client):
        url = reverse('project-list')
        data = {'title': 'test_title', 'description': 'test_desc'}
        response = client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED

    def test_project__add_project_invalid_data(self, project_default, client):
        url = reverse('project-list')
        data = {'description': 'test_desc'}
        response = client.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestTask:
    def test_task__get_tasks(self, project_default, task_default,
                             task_with_assignee, client):
        url = reverse('task-list', args=[1])
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_task__delete_task(self, project_default,
                               task_with_assignee, client):
        url = reverse('task-detail', args=[1, 1])
        response = client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_task__edit_task(self, project_default, task_with_assignee, client):
        url = reverse('task-detail', args=[1, 1])
        data = {
            'id': 1, 'title': 'test_title',
            'project': 1, 'creator': 1
        }
        response = client.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_200_OK

    def test_task__edit_task_invalid_data(self, project_default,
                                          task_with_assignee, client):
        url = reverse('task-detail', args=[1, 1])
        data = {
            'id': 1, 'project': 1, 'creator': 1
        }
        response = client.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_task__add_task(self, project_default, client):
        url = reverse('task-list', args=[1])
        data = {'title': 'test_title', 'project': 1}
        response = client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED

    def test_task__add_task_invalid_data(self, project_default, client):
        url = reverse('task-list', args=[1])
        data = {'project': 1}
        response = client.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_task__delete_task_no_permission(self, project_default, task_default, client):
        url = reverse('task-detail', args=[1, 1])
        response = client.delete(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_task__edit_task_no_permission(self, project_default, task_default, client):
        url = reverse('task-detail', args=[1, 1])
        data = {
            'id': 1, 'title': 'test_title',
            'project': 1, 'creator': 1
        }
        response = client.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestSprint:
    def test_sprint__get_sprints(self, project_default, sprint_default, client):
        url = reverse('sprint-list', args=[1])
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_sprint__delete_sprint(self, project_default, sprint_default, client):
        url = reverse('sprint-detail', args=[1, 1])
        response = client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_sprint__edit_sprint(self, project_default, sprint_default, client):
        url = reverse('sprint-detail', args=[1, 1])
        data = {
            'id': 1, 'title': 'test_title',
            'project': 1
        }
        response = client.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_200_OK

    def test_sprint__edit_sprint_invalid_data(self, project_default,
                                              sprint_default, client):
        url = reverse('sprint-detail', args=[1, 1])
        data = {
            'id': 1, 'project': 1, 'creator': 1
        }
        response = client.put(url, json.dumps(data), content_type='application/json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_sprint__add_sprint(self, project_default, client):
        url = reverse('sprint-list', args=[1])
        data = {'title': 'sprint_title', 'project': 1}
        response = client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED

    def test_sprint__add_sprint_invalid_data(self, project_default, client):
        url = reverse('sprint-list', args=[1])
        data = {'project': 1}
        response = client.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
