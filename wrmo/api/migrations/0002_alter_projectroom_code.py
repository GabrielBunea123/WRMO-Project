# Generated by Django 4.0.4 on 2022-08-30 21:07

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projectroom',
            name='code',
            field=models.CharField(default=api.models.generate_unique_code, max_length=20, unique=True),
        ),
    ]
