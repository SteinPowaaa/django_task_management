from django.shortcuts import render
from django.views.generic.base import TemplateView


class IndexPageView(TemplateView):
    template_name = 'todo/index.html'
