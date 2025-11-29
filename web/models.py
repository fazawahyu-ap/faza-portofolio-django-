from django.db import models

# 1. Translation
class Translation(models.Model):
    key = models.CharField(max_length=255, unique=True)
    val_id = models.TextField()
    val_en = models.TextField()

    def __str__(self):
        return self.key

# 2. SiteSetting
class SiteSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()

    def __str__(self):
        return f"{self.key}: {self.value}"

# 3. Project
class Project(models.Model):
    title_id = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200)
    desc_id = models.TextField()
    desc_en = models.TextField()
    tech_stack = models.CharField(max_length=255) # Disimpan sebagai string koma (e.g. "Python, Django")
    image = models.CharField(max_length=500, blank=True, null=True) # Nama file gambar
    video = models.CharField(max_length=500, blank=True, null=True)
    github_url = models.CharField(max_length=500, blank=True, null=True)
    external_url = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title_id

# 4. WorkExperience
class WorkExperience(models.Model):
    role_id = models.CharField(max_length=200)
    role_en = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    period = models.CharField(max_length=100)
    # Kita simpan poin-poin tanggung jawab dipisah dengan karakter '|' atau Enter
    responsibilities_id = models.TextField()
    responsibilities_en = models.TextField()
    start_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-start_date']

    def get_responsibilities_id_list(self):
        return self.responsibilities_id.split('\n')

    def get_responsibilities_en_list(self):
        return self.responsibilities_en.split('\n')

# 5. Organization
class Organization(models.Model):
    name = models.CharField(max_length=200)
    role_id = models.CharField(max_length=200) # Di update agar support bahasa
    role_en = models.CharField(max_length=200)
    period = models.CharField(max_length=100)
    description_id = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    start_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-start_date']

# 6. Education (BARU)
class Education(models.Model):
    institution = models.CharField(max_length=200)
    major_id = models.CharField(max_length=200)
    major_en = models.CharField(max_length=200)
    period = models.CharField(max_length=100)
    description_id = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    start_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-start_date']

# 7. Skill (BARU)
class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('technical', 'Technical'),
        ('tools', 'Tools'),
        ('nontech', 'Non-Technical'),
        ('lang', 'Language'),
    ]
    name_id = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    icon = models.CharField(max_length=50) # Nama icon Feather

    def __str__(self):
        return self.name_en