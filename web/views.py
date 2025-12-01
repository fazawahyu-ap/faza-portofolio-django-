import markdown
import google.generativeai as genai
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import (
    Project, 
    WorkExperience, 
    Education, 
    Organization, 
    Skill, 
    Translation, 
    SiteSetting,
    Certificate,
    Feedback # Pastikan model Feedback sudah dibuat
)

def index(request):
    # ==========================================
    # 1. AMBIL DATA UTAMA (Queryset)
    # ==========================================
    projects = Project.objects.all().order_by('order', '-created_at')
    
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

    # ==========================================
    # 2. PROSES TRANSLASI (Untuk JS & Template)
    # ==========================================
    trans_qs = Translation.objects.all()
    trans_dict = {
        'id': {},
        'en': {}
    }
    
    # Format JSON untuk JS: {'id': {'key': 'val'}, 'en': {'key': 'val'}}
    for t in trans_qs:
        trans_dict['id'][t.key] = t.val_id
        trans_dict['en'][t.key] = t.val_en

    translations_json = json.dumps(trans_dict)

    # ==========================================
    # 3. SITE SETTINGS
    # ==========================================
    cv_url = "#"
    cert_url = "#"
    gdev_url = "#"
    cloud_skill_url = "#"
    maintenance_mode = False

    try:
        all_settings = SiteSetting.objects.all()
        settings_map = {s.key: s.value for s in all_settings}

        if 'maintenance_mode' in settings_map:
            maintenance_mode = settings_map['maintenance_mode'].lower() == 'true'
        
        cv_url = settings_map.get('cv_url', '#')
        cert_url = settings_map.get('cert_url', '#')
        gdev_url = settings_map.get('gdev_url', '#') 
        cloud_skill_url = settings_map.get('cloud_skill_url', '#')

    except Exception as e:
        print(f"Error fetching settings: {e}")

    # ==========================================
    # 4. SUSUN CONTEXT
    # ==========================================
    context = {
        'projects': projects,
        'experiences': experiences,
        'educations': educations,
        'organizations': organizations,
        'skills': skills,
        'certificates': certificates,
        
        'translations_json': translations_json,
        'trans': trans_dict['id'], # Default Bahasa Indonesia untuk render awal
        
        'cv_url': cv_url,
        'cert_url': cert_url,
        'gdev_url': gdev_url,
        'cloud_skill_url': cloud_skill_url,
        
        'maintenance_mode': maintenance_mode,
    }

    if maintenance_mode:
        return render(request, 'web/maintenance.html', context)
        
    return render(request, 'web/index.html', context)

# View Khusus untuk AJAX Feedback Form
@require_POST
def submit_feedback(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not name or not email or not message:
            return JsonResponse({'status': 'error', 'message': 'Semua kolom wajib diisi!'}, status=400)

        Feedback.objects.create(name=name, email=email, message=message)
        return JsonResponse({'status': 'success', 'message': 'Pesan berhasil dikirim!'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    

@require_POST
def chat_with_ai(request):
    try:
        data = json.loads(request.body)
        user_message = data.get('message')
        
        if not user_message:
            return JsonResponse({'status': 'error', 'message': 'Pesan kosong'}, status=400)

        # 1. Konfigurasi API Key dari Settings
        if not settings.GEMINI_API_KEY:
             return JsonResponse({'status': 'error', 'message': 'API Key belum disetting'}, status=500)
        
        genai.configure(api_key=settings.GEMINI_API_KEY)

        # 2. Ambil Data Portofolio (Context)
        projects = Project.objects.all()
        experiences = WorkExperience.objects.all()
        skills = Skill.objects.all()
        educations = Education.objects.all()
        
        # 3. Susun Prompt (Instruksi untuk AI)
        context_text = """
        You are "Faza AI", a smart portfolio assistant for Faza Wahyu Adi Putra.
        Your goal is to answer questions about Faza based STRICTLY on the data below.
        
        Style: Professional, friendly, and concise.
        Language: Use the same language as the User (Indonesian or English).
        
        [FAZA'S DATA]
        """
        
        # Masukkan Skills
        tech_skills = ", ".join([s.name_en for s in skills if s.category == 'technical'])
        context_text += f"\n- Technical Skills: {tech_skills}"
        
        # Masukkan Experience
        context_text += "\n- Work Experience:"
        for exp in experiences:
            context_text += f"\n  * {exp.role_en} at {exp.company} ({exp.period}). Role: {exp.responsibilities_en}"

        # Masukkan Projects
        context_text += "\n- Projects:"
        for proj in projects:
            context_text += f"\n  * {proj.title_en}: {proj.desc_en} (Stack: {proj.tech_stack})"

        # Masukkan Education
        context_text += "\n- Education:"
        for edu in educations:
            context_text += f"\n  * {edu.institution} - {edu.major_en} ({edu.period})"

        # Instruksi User
        context_text += f"\n\n[USER]: {user_message}\n[YOU]:"

        # 4. Kirim ke Gemini
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(context_text)
        
        # 5. Format hasil ke HTML (agar list/bold rapi)
        ai_reply_html = markdown.markdown(response.text)

        return JsonResponse({'status': 'success', 'reply': ai_reply_html})

    except Exception as e:
        print(f"AI Error: {e}")
        return JsonResponse({'status': 'error', 'message': 'Maaf, AI sedang sibuk.'}, status=500)