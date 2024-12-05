from django.db import models
from django.utils import timezone # Funcionalidad de fechas
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager # Modelos personalizados de usuarios

# Modelo para representar los Departamentos
class Department(models.Model):
    name_depart = models.CharField(max_length=100)
    
    def __str__(self):
	    return self.name_depart

# Manager personalizado para el modelo de usuario, es como una interfaz la cual se accede a la base de datos y se realizan operaciones de consulta y manipulación de datos.
class CustomUserManager(UserManager):
    # Crear usuario genérico
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Los usuarios deben tener una dirección de correo electrónico.')

        email = self.normalize_email(email) #tranforma en minusculas

        user = self.model(
            email=email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user
    
    # Crear un usuario normal
    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_active", True)
        return self._create_user(email, password, **extra_fields)

    # Crear un superusuario
    def create_superuser(self, email=None, password=None, **extra_fields):
         extra_fields.setdefault('is_staff', True)
         extra_fields.setdefault('is_active', True)
         return self._create_user( email, password, **extra_fields)
    
# Modelo de usuario personalizado
class User(AbstractBaseUser, PermissionsMixin):
    code = models.CharField(max_length=10, unique=True)
    email = models.EmailField(max_length=50, unique=True)
    name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    degree = models.ForeignKey(Department, on_delete=models.CASCADE, default=5)
    avatar = models.ImageField(default='avatar.png')
    cover_image = models.ImageField(default='cover.png')
    date_joined = models.DateTimeField(default=timezone.now)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager() # Usar el CustomUserManager en lugar del predeterminado
    USERNAME_FIELD = "email" # Autenticar mediante el email, no por el campo de nombre de usuario que viene por defecto
    REQUIRED_FIELDS = ["code", "name", "last_name"]

    class Meta:
        ordering = ["-date_joined"] # Ordena por fecha de ingreso

    def __str__(self):
	    return f" {self.name} {self.last_name}"