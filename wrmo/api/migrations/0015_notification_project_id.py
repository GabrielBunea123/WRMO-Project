# Generated by Django 4.0.4 on 2022-10-03 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_notification_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='project_id',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
