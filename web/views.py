import json
from django.shortcuts import render
from .models import (
    Project, 
    WorkExperience, 
    Education, 
    Organization, 
    Skill, 
    Translation, 
    SiteSetting,
    Certificate
)

def index(request):
    # 1. AMBIL DATA DARI DATABASE
    projects = Project.objects.all().order_by('order', '-created_at')
    
    # Gunakan try-except untuk menghindari error jika tabel belum dimigrasi sempurna
    try:
        experiences = WorkExperience.objects.all().order_by('-start_date')
    except:
        experiences = []

    try:
        educations = Education.objects.all().order_by('-start_date')
    except:
        educations = []

    try:
        organizations = Organization.objects.all().order_by('-start_date')
    except:
        organizations = []

    skills = Skill.objects.all()
    certificates = Certificate.objects.all()

    # 2. PROSES TRANSLASI (PERBAIKAN DI SINI)
    trans_qs = Translation.objects.all()
    trans_dict = {}
    
    for t in trans_qs:
        trans_dict[t.key] = {
            'id': t.val_id,   # <--- SUDAH DIPERBAIKI (val_id)
            'en': t.val_en    # <--- SUDAH DIPERBAIKI (val_en)
        }

    translations_json = json.dumps(trans_dict)

# 3. SETTING TAMBAHAN
    maintenance_mode = False
    cv_url = "#" # Default jika belum diisi di admin
    cert_url = "#"

    try:
        # Cek Maintenance Mode
        mt_setting = SiteSetting.objects.filter(key='maintenance_mode').first()
        if mt_setting and mt_setting.value.lower() == 'true':
            maintenance_mode = True
            
        # AMBIL LINK CV DARI DATABASE (Kode Baru)
        cv_setting = SiteSetting.objects.filter(key='cv_url').first()
        if cv_setting:
            cv_url = cv_setting.value

        # Ambil Link Sertifikat (KODE BARU DISINI)
        cert_setting = SiteSetting.objects.filter(key='cert_url').first()
        if cert_setting:
            cert_url = cert_setting.value
    except:
        pass

    # 4. SUSUN CONTEXT
    context = {
        'projects': projects,
        'experiences': experiences,
        'educations': educations,
        'organizations': organizations,
        'skills': skills,
        'certificates': certificates,
        'trans': trans_dict,
        'translations_json': translations_json,
        'maintenance_mode': maintenance_mode,
        'cv_url': cv_url, # <--- JANGAN LUPA TAMBAHKAN INI
        'cert_url': cert_url,
    }
    # 5. RENDER
    if maintenance_mode:
        return render(request, 'web/maintenance.html', context)
        
    return render(request, 'web/index.html', context)