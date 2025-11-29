from django.core.management.base import BaseCommand
from web.models import Translation, Project, WorkExperience, Organization, Education, Skill, SiteSetting
from datetime import date

class Command(BaseCommand):
    help = 'Import ALL data from old app.py to Django Database'

    def handle(self, *args, **kwargs):
        self.stdout.write("Memulai import data besar-besaran...")

        # 1. HAPUS DATA LAMA (Agar tidak duplikat saat dijalankan ulang)
        Translation.objects.all().delete()
        Project.objects.all().delete()
        WorkExperience.objects.all().delete()
        Organization.objects.all().delete()
        Education.objects.all().delete()
        Skill.objects.all().delete()
        SiteSetting.objects.all().delete()

        # ==========================================
        # A. TRANSLATIONS (Dari app.py Anda)
        # ==========================================
        # Saya ambil langsung dari dictionary Anda
        translations_data = {
            "id": {
                "nav_about": "Tentang", "nav_experience": "Pengalaman", "nav_projects": "Proyek", 
                "nav_skills_certs": "Keahlian & Sertifikat", "nav_edu_org": "Pendidikan & Organisasi",
                "hero_title": "Faza Wahyu Adi Putra", "hero_subtitle": "IT Support & Developer",
                "hero_cv_button": "Download CV", "hero_about_button": "Tentang Saya", "hero_email_button": "Email",
                "about_title": "Tentang Saya",
                "about_summary": "Saya mahasiswa Teknik Informatika yang tertarik pada divisi IT Support. Memiliki 9 bulan pengalaman PKL dalam divisi Preventive Maintenance & Pemeliharaan Dasar Hardware, Dasar-dasar Jaringan (Networking). Berpengalaman dalam lingkungan kerja yang membutuhkan ketelitian dan respons cepat. Siap untuk segera memberikan dukungan teknis dan berkontribusi dalam tim Anda.",
                "about_name_label": "Nama:", "about_name_value": "Faza Wahyu Adi Putra",
                "about_location_label": "Lokasi:", "about_location_value": "Semarang, Indonesia",
                "about_email_label": "Email:",
                "work_title": "Pengalaman Kerja Lapangan", "work_gallery_button": "Lihat Dokumentasi",
                "projects_title": "Proyek Pilihan", "proj_photo_button": "Foto", "proj_video_button": "Video", "proj_url_button": "Kunjungi Situs",
                "skills_certs_title": "Keahlian & Sertifikasi", "skills_cat_tech": "Teknis", 
                "skills_cat_nontech": "Non-Teknis", "skills_cat_lang": "Bahasa",
                "skill_subcat_it": "Infrastruktur & Dukungan IT", "skill_subcat_dev": "Pengembangan Web", "skill_subcat_tools": "Tools & Perangkat Lunak",
                "cert_title": "Sertifikasi", "cert_desc": "Saya memiliki berbagai sertifikasi yang menunjukkan komitmen saya untuk terus belajar dan berkembang dalam bidang IT.", "cert_button": "Lihat Semua Sertifikat",
                "edu_org_title": "Pendidikan & Organisasi", "education_title": "Pendidikan", "org_title": "Organisasi", "org_details_button": "Lihat Detail",
                "footer_cta": "Tertarik untuk berkolaborasi?", "footer_cta_short": "Hire Me",
                "footer_form_title": "Kritik & Saran", "footer_form_placeholder": "Tuliskan pesan Anda di sini...", "footer_form_button": "Kirim Pesan",
                "footer_copyright": "Didesain & dikembangkan oleh Faza.",
                # Tambahan Achievement Text
                "achieve_1_title": "Pemenang Merchandise Tier 1 di #JuaraGCP Season 11 2025!",
                "achieve_1_date": "Mei 2025",
                "achieve_1_desc": "Termasuk kedalam 1.000 dari 12.000 peserta dengan nilai terbaik...",
                "achieve_gallery_button": "Lihat Gambar",
                "profiles_skills_title": "Google Cloud Skills Boost",
            },
            "en": {
                "nav_about": "About", "nav_experience": "Experience", "nav_projects": "Projects", 
                "nav_skills_certs": "Skills & Certificates", "nav_edu_org": "Education & Organization",
                "hero_title": "Faza Wahyu Adi Putra", "hero_subtitle": "IT Support & Developer",
                "hero_cv_button": "Download CV", "hero_about_button": "About Me", "hero_email_button": "Email",
                "about_title": "About Me",
                "about_summary": "I am an Informatics Engineering student interested in the IT Support division. I have 9 months of internship experience in Preventive Maintenance & Basic Hardware Maintenance, and Networking fundamentals. Experienced in a work environment that requires precision and quick response. Ready to provide technical support and contribute to your team immediately.",
                "about_name_label": "Name:", "about_name_value": "Faza Wahyu Adi Putra",
                "about_location_label": "Location:", "about_location_value": "Semarang, Indonesia",
                "about_email_label": "Email:",
                "work_title": "Field Work Experience", "work_gallery_button": "View Documentation",
                "projects_title": "Featured Projects", "proj_photo_button": "Photos", "proj_video_button": "Video", "proj_url_button": "Visit Site",
                "skills_certs_title": "My Skills & Certifications", "skills_cat_tech": "Technical", 
                "skills_cat_nontech": "Non-Technical", "skills_cat_lang": "Languages",
                "skill_subcat_it": "IT Infrastructure & Support", "skill_subcat_dev": "Web Development", "skill_subcat_tools": "Tools & Software",
                "cert_title": "Certifications", "cert_desc": "I hold various certifications that demonstrate my commitment to continuous learning and development in the IT field.", "cert_button": "View All Certificates",
                "edu_org_title": "Education & Organization", "education_title": "Education", "org_title": "Organization", "org_details_button": "View Details",
                "footer_cta": "Interested in collaborating?", "footer_cta_short": "Hire Me",
                "footer_form_title": "Feedback & Suggestions", "footer_form_placeholder": "Write your message here...", "footer_form_button": "Send Message",
                "footer_copyright": "Designed & developed by Faza.",
                "achieve_1_title": "Tier 1 Merchandise Winner at #JuaraGCP Season 11 2025!",
                "achieve_1_date": "May 2025",
                "achieve_1_desc": "Finished in the top 1,000 of 12,000 participants...",
                "achieve_gallery_button": "View Images",
                "profiles_skills_title": "Google Cloud Skills Boost",
            }
        }

        # Loop insert Translation
        count = 0
        for key, val_id in translations_data['id'].items():
            val_en = translations_data['en'].get(key, val_id) # Fallback ke ID jika EN tidak ada
            Translation.objects.create(key=key, val_id=val_id, val_en=val_en)
            count += 1
        self.stdout.write(f"--> {count} Translations berhasil diimport.")

        # ==========================================
        # B. EDUCATION (Data Baru)
        # ==========================================
        edus = [
            {
                "inst": "Universitas Dian Nuswantoro",
                "major_id": "D3 Teknik Informatika", "major_en": "D3 Informatics Engineering",
                "period": "2024 - Sekarang",
                "desc_id": "Fokus pada pengembangan perangkat lunak dan infrastruktur IT.",
                "desc_en": "Focusing on software development and IT infrastructure.",
                "start": date(2024, 1, 1)
            },
            {
                "inst": "SMK Negeri 2 Tasikmalaya",
                "major_id": "Sistem Informasi, Jaringan & Aplikasi", "major_en": "Information Systems, Networking & Applications",
                "period": "2020 - 2024",
                "desc_id": "Program 4 tahun mendalami rekayasa perangkat lunak & jaringan.",
                "desc_en": "A 4-year vocational program specializing in software engineering.",
                "start": date(2020, 1, 1)
            }
        ]
        for e in edus:
            Education.objects.create(
                institution=e['inst'], major_id=e['major_id'], major_en=e['major_en'],
                period=e['period'], description_id=e['desc_id'], description_en=e['desc_en'],
                start_date=e['start']
            )
        self.stdout.write(f"--> {len(edus)} Education berhasil diimport.")

        # ==========================================
        # C. WORK EXPERIENCE
        # ==========================================
        works = [
            {
                "role_id": "Preventive Maintenance", "role_en": "Preventive Maintenance",
                "company": "PT. Putra Mulia Telecommunication",
                "period": "Aug 2023 - Nov 2023",
                "resp_id": "Preventif Maintenance.\nBertanggung jawab atas kebersihan shelter.\nBekerja sesuai standar K3.",
                "resp_en": "Preventive Maintenance.\nResponsible for shelter cleanliness.\nWorked according to H&S standards.",
                "start": date(2023, 8, 1)
            },
            {
                "role_id": "Technical Support", "role_en": "Technical Support",
                "company": "CV. Arjuna Jaya Sakti",
                "period": "Mar 2023 - Jul 2023",
                "resp_id": "Troubleshooting CCTV.\nDukungan teknis operasional.\nMerancang konten video.",
                "resp_en": "CCTV Troubleshooting.\nTechnical support.\nDesigned video content.",
                "start": date(2023, 3, 1)
            }
        ]
        for w in works:
            WorkExperience.objects.create(
                role_id=w['role_id'], role_en=w['role_en'], company=w['company'],
                period=w['period'], responsibilities_id=w['resp_id'], responsibilities_en=w['resp_en'],
                start_date=w['start']
            )
        self.stdout.write(f"--> {len(works)} Work Experience berhasil diimport.")

        # ==========================================
        # D. PROJECTS
        # ==========================================
        projects = [
            {
                "title_id": "Project Smart Lamp (IoT)", "title_en": "Smart Lamp Project (IoT)",
                "desc_id": "Sistem pengendalian lampu otomatis menggunakan aplikasi Google Assistant",
                "desc_en": "Automatic lamp control system using the Google Assistant application.",
                "tech": "C/C++, Arduino", "image": "smk3.jpeg", 
                "github": "https://github.com/Raka-coder/project-smarthome-pio", "ext": None
            },
            {
                "title_id": "Website Peta : QGIS + Database + API", "title_en": "Map Website: QGIS + Database + API",
                "desc_id": "WebGIS interaktif berbasis QGIS yang terhubung database.",
                "desc_en": "Interactive WebGIS based on QGIS connected to a database.",
                "tech": "HTML, CSS, JS, PHP", "image": "ui-1.jpg", 
                "github": None, "ext": None
            },
            {
                "title_id": "Generator Email Sementara", "title_en": "Temporary Email Generator",
                "desc_id": "Situs web generator email sementara untuk melindungi privasi.",
                "desc_en": "A temporary email generator website to protect privacy.",
                "tech": "Next.js, TypeScript", "image": "", 
                "github": None, "ext": "https://mail-za.vercel.app/"
            }
        ]
        for p in projects:
            Project.objects.create(
                title_id=p['title_id'], title_en=p['title_en'],
                desc_id=p['desc_id'], desc_en=p['desc_en'],
                tech_stack=p['tech'], image=p['image'],
                github_url=p['github'], external_url=p['ext']
            )
        self.stdout.write(f"--> {len(projects)} Projects berhasil diimport.")

        # ==========================================
        # E. ORGANIZATION
        # ==========================================
        orgs = [
            {
                "name": "Himpunan Mahasiswa DTI",
                "role_id": "Divisi Media", "role_en": "Media Division",
                "period": "2024 - Sekarang",
                "desc_id": "Bertanggung jawab atas branding visual dan dokumentasi.",
                "desc_en": "Responsible for visual branding and documentation.",
                "start": date(2024, 1, 1)
            },
            {
                "name": "Google Developer Group on Campus (GDGoC)",
                "role_id": "Anggota", "role_en": "Member",
                "period": "2024 - Sekarang",
                "desc_id": "Anggota aktif komunitas developer.",
                "desc_en": "Active member of developer community.",
                "start": date(2024, 1, 1)
            }
        ]
        for o in orgs:
            Organization.objects.create(
                name=o['name'], role_id=o['role_id'], role_en=o['role_en'],
                period=o['period'], description_id=o['desc_id'], description_en=o['desc_en'],
                start_date=o['start']
            )
        self.stdout.write(f"--> {len(orgs)} Organizations berhasil diimport.")

        # ==========================================
        # F. SKILLS (Untuk Icon dinamis)
        # ==========================================
        skills = [
            # Technical
            {"name_id": "Hardware Troubleshooting", "name_en": "Hardware Troubleshooting", "cat": "technical", "icon": "tool"},
            {"name_id": "Networking", "name_en": "Networking", "cat": "technical", "icon": "wifi"},
            {"name_id": "Python", "name_en": "Python", "cat": "technical", "icon": "code"},
            {"name_id": "Web Development", "name_en": "Web Development", "cat": "technical", "icon": "layout"},
            # Tools
            {"name_id": "VS Code", "name_en": "VS Code", "cat": "tools", "icon": "terminal"},
            {"name_id": "Cisco Packet Tracer", "name_en": "Cisco Packet Tracer", "cat": "tools", "icon": "activity"},
            {"name_id": "Figma", "name_en": "Figma", "cat": "tools", "icon": "pen-tool"},
        ]
        for s in skills:
            Skill.objects.create(
                name_id=s['name_id'], name_en=s['name_en'],
                category=s['cat'], icon=s['icon']
            )
        self.stdout.write(f"--> {len(skills)} Skills berhasil diimport.")

        self.stdout.write(self.style.SUCCESS('SEMUA DATA SUDAH MASUK DATABASE! SIAP DITAMPILKAN! 🚀'))