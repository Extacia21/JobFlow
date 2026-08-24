from django.urls import path
from . import views


urlpatterns = [

    path(
        '',
        views.dashboard,
        name='dashboard'
    ),

    path(
        'jobs/add/',
        views.add_job,
        name='add_job'
    ),

    path(
        'jobs/<int:job_id>/',
        views.job_detail,
        name='job_detail'
    ),

    path(
        'jobs/<int:job_id>/edit/',
        views.edit_job,
        name='edit_job'
    ),

    path(
        'jobs/<int:job_id>/delete/',
        views.delete_job,
        name='delete_job'
    ),

]
