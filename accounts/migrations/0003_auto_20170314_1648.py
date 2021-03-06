# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-14 16:48
from __future__ import unicode_literals

import accounts.models
from django.db import migrations
import imagekit.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20170314_1624'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar_thumbnail',
            field=imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to=accounts.models.user_directory_path),
        ),
    ]
