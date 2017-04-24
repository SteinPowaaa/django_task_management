# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-18 12:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0013_task_comments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='comments',
            field=models.ManyToManyField(related_name='task_comments', to='todo.Comment'),
        ),
    ]