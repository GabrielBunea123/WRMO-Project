# Generated by Django 4.0.4 on 2022-09-19 18:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_joinprojectrequest_accepted_joinprojectrequest_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='joinprojectrequest',
            name='intention',
        ),
    ]
