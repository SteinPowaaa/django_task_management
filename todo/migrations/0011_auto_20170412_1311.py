# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-12 13:11
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0010_auto_20170329_0805'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sprint',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='todo.Project'),
        ),
        migrations.AlterField(
            model_name='task',
            name='forecast',
            field=models.NullBooleanField(),
        ),
        migrations.AlterField(
            model_name='task',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='todo.Project'),
        ),
    ]
