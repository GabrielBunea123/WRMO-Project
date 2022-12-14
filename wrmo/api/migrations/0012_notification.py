# Generated by Django 4.0.4 on 2022-09-21 05:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0011_remove_joinprojectrequest_intention'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(blank=True, default='unread', max_length=264, null=True)),
                ('type_of_notification', models.CharField(blank=True, max_length=264, null=True)),
                ('user_revoker', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_revoker', to=settings.AUTH_USER_MODEL)),
                ('user_sender', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_sender', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
