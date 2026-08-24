from django import forms
from .models import Job


class JobForm(forms.ModelForm):

    class Meta:
        model = Job
        fields = [
            'company',
            'position',
            'location',
            'job_url',
            'salary',
            'date_applied',
            'status',
            'notes',
        ]

        widgets = {
            'company': forms.TextInput(attrs={
                'placeholder': 'e.g. Microsoft'
            }),

            'position': forms.TextInput(attrs={
                'placeholder': 'e.g. Virtual Assistant'
            }),

            'location': forms.TextInput(attrs={
                'placeholder': 'e.g. Remote'
            }),

            'job_url': forms.URLInput(attrs={
                'placeholder': 'https://example.com/job'
            }),

            'salary': forms.TextInput(attrs={
                'placeholder': 'e.g. $800 - $1,200'
            }),

            'date_applied': forms.DateInput(
                attrs={'type': 'date'}
            ),

            'notes': forms.Textarea(attrs={
                'placeholder': 'Add notes about this job...',
                'rows': 4
            }),
        }
