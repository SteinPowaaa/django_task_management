# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-20 13:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0002_auto_20170220_1311'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='status',
            field=models.CharField(choices=[('todo', 'Todo'), ('in-progress', 'In Progress'), ('completed', 'Completed')], default='todo', max_length=30),
        ),
    ]
