# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-28 08:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0006_remove_sprint_tasks'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='sprint',
        ),
        migrations.AddField(
            model_name='task',
            name='sprint',
            field=models.ManyToManyField(blank=True, null=True, to='todo.Sprint'),
        ),
    ]
