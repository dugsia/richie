# Generated by Django 2.1.9 on 2019-06-12 15:43

from django.db import migrations

import richie.apps.core.fields.duration
import richie.apps.core.fields.effort


class Migration(migrations.Migration):

    dependencies = [("courses", "0002_auto_20190429_0901")]

    operations = [
        migrations.AddField(
            model_name="course",
            name="effort",
            field=richie.apps.core.fields.effort.EffortField(
                blank=True,
                default_effort_unit="week",
                default_reference_unit="month",
                time_units={
                    "day": ("day", "days"),
                    "hour": ("hour", "hours"),
                    "minute": ("minute", "minutes"),
                    "month": ("month", "months"),
                    "week": ("week", "weeks"),
                },
                max_length=80,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="course",
            name="duration",
            field=richie.apps.core.fields.duration.CompositeDurationField(
                blank=True,
                default_unit="hour",
                time_units={
                    "day": ("day", "days"),
                    "hour": ("hour", "hours"),
                    "minute": ("minute", "minutes"),
                    "month": ("month", "months"),
                    "week": ("week", "weeks"),
                },
                max_length=80,
                null=True,
            ),
        ),
    ]