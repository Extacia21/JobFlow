from django.shortcuts import render, redirect, get_object_or_404
from .models import Job
from .forms import JobForm


def dashboard(request):
    jobs = Job.objects.all().order_by('-created_at')

    total_jobs = jobs.count()
    interviews = jobs.filter(status='interview').count()
    rejected = jobs.filter(status='rejected').count()
    offers = jobs.filter(status='offer').count()

    context = {
        'jobs': jobs[:5],
        'total_jobs': total_jobs,
        'interviews': interviews,
        'rejected': rejected,
        'offers': offers,
    }

    return render(request, 'jobs/dashboard.html', context)


def add_job(request):

    if request.method == 'POST':
        form = JobForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('dashboard')

    else:
        form = JobForm()

    return render(request, 'jobs/job_form.html', {
        'form': form,
        'page_title': 'Add Job',
    })


def job_detail(request, job_id):

    job = get_object_or_404(Job, id=job_id)

    return render(request, 'jobs/job_detail.html', {
        'job': job,
    })


def edit_job(request, job_id):

    job = get_object_or_404(Job, id=job_id)

    if request.method == 'POST':
        form = JobForm(request.POST, instance=job)

        if form.is_valid():
            form.save()
            return redirect('job_detail', job_id=job.id)

    else:
        form = JobForm(instance=job)

    return render(request, 'jobs/job_form.html', {
        'form': form,
        'page_title': 'Edit Job',
    })


def delete_job(request, job_id):

    job = get_object_or_404(Job, id=job_id)

    if request.method == 'POST':
        job.delete()
        return redirect('dashboard')

    return render(request, 'jobs/job_confirm_delete.html', {
        'job': job,
    })

