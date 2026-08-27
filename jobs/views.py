from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.db.models import Count, Q

from .models import Job
from .forms import JobForm
from django.db.models import Q
from django.shortcuts import (
    render,
    redirect,
    get_object_or_404
)


def dashboard(request):

    jobs = Job.objects.all().order_by("-created_at")[:5]

    context = {
        "jobs": jobs,

        "total_jobs": Job.objects.count(),

        "saved": Job.objects.filter(
            status="saved"
        ).count(),

        "applied": Job.objects.filter(
            status="applied"
        ).count(),

        "screening": Job.objects.filter(
            status="screening"
        ).count(),

        "interviews": Job.objects.filter(
            status="interview"
        ).count(),

        "offers": Job.objects.filter(
            status="offer"
        ).count(),

        "rejected": Job.objects.filter(
            status="rejected"
        ).count(),
    }

    return render(
        request,
        "jobs/dashboard.html",
        context
    )


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

    job = get_object_or_404(
        Job,
        id=job_id
    )


    if request.method == "POST":

        job.company = request.POST.get("company")
        job.position = request.POST.get("position")
        job.location = request.POST.get("location")
        job.job_url = request.POST.get("job_url")
        job.salary = request.POST.get("salary")

        job.date_applied = (
            request.POST.get("date_applied")
            or None
        )

        job.status = request.POST.get("status")
        job.notes = request.POST.get("notes")

        job.save()

        return redirect(
            "job_detail",
            job_id=job.id
        )


    return render(
        request,
        "jobs/edit_job.html",
        {
            "job": job,
            "status_choices": Job.STATUS_CHOICES,
        }
    )


def delete_job(request, job_id):

    job = get_object_or_404(Job, id=job_id)

    if request.method == 'POST':
        job.delete()
        return redirect('dashboard')

    return render(request, 'jobs/job_confirm_delete.html', {
        'job': job,
    })


def applications(request):

    jobs = Job.objects.all().order_by("-created_at")

    search_query = request.GET.get(
        "search",
        ""
    ).strip()

    selected_status = request.GET.get(
        "status",
        ""
    ).strip()


    if search_query:

        jobs = jobs.filter(

            Q(company__icontains=search_query) |

            Q(position__icontains=search_query) |

            Q(location__icontains=search_query)

        )


    if selected_status:

        jobs = jobs.filter(
            status=selected_status
        )


    context = {

        "jobs": jobs,

        "search_query": search_query,

        "selected_status": selected_status,

        "status_choices": Job.STATUS_CHOICES,

        "total_jobs": Job.objects.count(),

        "applied_count":
            Job.objects.filter(
                status="applied"
            ).count(),

        "interview_count":
            Job.objects.filter(
                status="interview"
            ).count(),

        "offer_count":
            Job.objects.filter(
                status="offer"
            ).count(),

    }


    return render(
        request,
        "jobs/applications.html",
        context
    )


def pipeline(request):

    jobs = Job.objects.all()


    pipeline = {

        "saved":
            jobs.filter(
                status="saved"
            ),

        "applied":
            jobs.filter(
                status="applied"
            ),

        "screening":
            jobs.filter(
                status="screening"
            ),

        "interview":
            jobs.filter(
                status="interview"
            ),

        "offer":
            jobs.filter(
                status="offer"
            ),

        "rejected":
            jobs.filter(
                status="rejected"
            ),

    }


    total_jobs = jobs.count()


    interview_count = jobs.filter(
        status="interview"
    ).count()


    offer_count = jobs.filter(
        status="offer"
    ).count()


    active_jobs = jobs.exclude(
        status__in=[
            "offer",
            "rejected"
        ]
    ).count()


    if total_jobs:

        interview_rate = round(
            (
                interview_count /
                total_jobs
            ) * 100,
            1
        )


        offer_rate = round(
            (
                offer_count /
                total_jobs
            ) * 100,
            1
        )

    else:

        interview_rate = 0

        offer_rate = 0


    return render(
        request,
        "jobs/pipeline.html",
        {
            "pipeline": pipeline,

            "total_jobs":
                total_jobs,

            "interview_rate":
                interview_rate,

            "offer_rate":
                offer_rate,

            "active_jobs":
                active_jobs,
        }
    )


@require_POST
def update_job_status(request, job_id):

    job = get_object_or_404(
        Job,
        id=job_id
    )

    new_status = request.POST.get("status")

    valid_statuses = dict(Job.STATUS_CHOICES)

    if new_status not in valid_statuses:
        return JsonResponse(
            {
                "success": False,
                "error": "Invalid status."
            },
            status=400
        )

    job.status = new_status
    job.save(update_fields=["status"])

    return JsonResponse(
        {
            "success": True,
            "status": job.status,
            "status_label": valid_statuses[new_status]
        }
    )

