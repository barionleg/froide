# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-08-10 17:08
from __future__ import unicode_literals

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("foirequest", "0028_auto_20180807_1520"),
        ("publicbody", "0022_auto_20180726_1151"),
        ("document", "0013_auto_20180810_1651"),
    ]

    operations = [
        migrations.AddField(
            model_name="document",
            name="foirequest",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="foirequest.FoiRequest",
            ),
        ),
        migrations.AddField(
            model_name="document",
            name="publicbody",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="publicbody.PublicBody",
            ),
        ),
    ]
