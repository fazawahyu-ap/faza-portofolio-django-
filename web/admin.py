from django.contrib import admin
from .models import Translation, SiteSetting, Project, WorkExperience, Organization, Education, Skill, Feedback

# 1. Translation Admin
@admin.register(Translation)
class TranslationAdmin(admin.ModelAdmin):
    list_display = ('key', 'val_id', 'val_en')
    search_fields = ('key', 'val_id', 'val_en')
    ordering = ('key',)

# 2. SiteSetting Admin
@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'value')
    search_fields = ('key',)

# 3. Project Admin
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title_id', 'tech_stack', 'order', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title_id', 'title_en', 'tech_stack')
    ordering = ('order', '-created_at')

# 4. Work Experience Admin
@admin.register(WorkExperience)
class WorkExperienceAdmin(admin.ModelAdmin):
    list_display = ('role_id', 'company', 'period', 'start_date')
    list_filter = ('company',)
    search_fields = ('role_id', 'company')
    ordering = ('-start_date',)

# 5. Organization Admin (YANG ERROR TADI SUDAH DIPERBAIKI DISINI)
@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    # Ubah 'role' menjadi 'role_id'
    list_display = ('role_id', 'name', 'period', 'start_date')
    search_fields = ('name', 'role_id')
    ordering = ('-start_date',)

# 6. Education Admin (BARU)
@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('institution', 'major_id', 'period', 'start_date')
    search_fields = ('institution', 'major_id')
    ordering = ('-start_date',)

# 7. Skill Admin (BARU)
@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'category', 'icon')
    list_filter = ('category',)
    search_fields = ('name_id', 'name_en')

# 8. Form
@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)