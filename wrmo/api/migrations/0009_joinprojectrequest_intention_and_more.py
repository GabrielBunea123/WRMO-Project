# Generated by Django 4.0.4 on 2022-09-19 18:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_joinprojectrequest'),
    ]

    operations = [
        migrations.AddField(
            model_name='joinprojectrequest',
            name='intention',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='joinprojectrequest',
            name='project_id',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
