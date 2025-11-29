import json # <--- JANGAN LUPA IMPORT INI
from django.shortcuts import render
from .models import Translation, SiteSetting, Project, WorkExperience, Organization

def index(request):
    # 1. Cek Maintenance Mode
    maintenance_mode = SiteSetting.objects.filter(key='maintenance_mode').first()
    if maintenance_mode and maintenance_mode.value == 'True':
        return render(request, 'web/maintenance.html')

    # 2. Ambil data Portofolio
    projects = Project.objects.all()
    experiences = WorkExperience.objects.all()
    organizations = Organization.objects.all()
    
    # 3. AMBIL TRANSLATION & FORMAT ULANG (PENTING!)
    translations = Translation.objects.all()
    
    # Kita buat 2 dictionary terpisah: satu untuk ID, satu untuk EN
    # Ini format yang dibutuhkan oleh main.js Anda
    translations_data = {
        "id": {},
        "en": {}
    }

    # Kita juga butuh format sederhana untuk Server Side Rendering (Tampilan awal)
    # Agar saat loading pertama, teksnya sudah muncul (SEO Friendly)
    trans_ssr = {}

    for t in translations:
        # Isi data untuk JavaScript
        translations_data["id"][t.key] = t.val_id
        translations_data["en"][t.key] = t.val_en
        
        # Isi data untuk HTML awal (Default ID)
        trans_ssr[t.key] = {
            'id': t.val_id,
            'en': t.val_en
        }

    context = {
        'projects': projects,
        'experiences': experiences,
        'organizations': organizations,
        'trans': trans_ssr, # Untuk dipanggil {{ trans.key.id }} di HTML
        'translations_json': json.dumps(translations_data), # Untuk JavaScript
    }

    return render(request, 'web/index.html', context)