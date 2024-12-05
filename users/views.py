from rest_framework import status
from rest_framework import generics
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q

from . models import *
from . serializers import *
from . permissions import IsUserOrReadOnly

# Crear vistas y lógica para las peticiones

# Buscar usuarios
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search(request):
    query = request.query_params.get('query', None) # Buscar por parametro
    if query is not None:
        users = User.objects.filter(name__icontains=query)
        serializers = SearchSerializer(users, many=True)
        return Response({ 'users': serializers.data })
    else:
        return Response({'users': []})

# Detalle de Usuario
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all() # Obtener los objetos de usuario
    serializer_class = UserSerializer # Especifica que serializador estamos utilizando
    permission_classes = [IsAuthenticated, IsUserOrReadOnly] # Permisos requeridos como autenticacion y personalizados
    lookup_field = 'name' # Especificación del campo de búsqueda para recuperar objetos de usuario
    lookup_url_kwarg = 'name' # Especificación del nombre del argumento de URL para buscar el campo de búsqueda

@api_view(['POST']) # Función http 
def register(request):
    data = request.data # Obtener datos de la solicitud
    department_id = data['degree']  # ID del departamento enviado en los datos del formulario
    department = get_object_or_404(Department, pk=department_id)  # Obtener el objeto Department basado mediante el id

    # Crear un nuevo usuario con los datos proporcionados y hashear la contraseña
    user = User.objects.create(
        code=data['code'],
        email=data['email'],
        name=data['name'],
        last_name=data['last_name'],
        degree=department, # Asignar el objeto Department
        password=make_password(data['password']) # Hashear la contraseña
    )

    # Serializar(convertir a JSON) la información del nuevo usuario
    serializer = MyUserSerializer(user, many=False)
    return Response(serializer.data)

# Vista de Login (usando TokenObtainPairView para la autenticación y generar token)
class MyTokenObtainPairSerializer(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Lista de departamentos (vista que muestra todos los departamentos disponibles)
class DepartmentList(generics.ListAPIView):
    queryset = Department.objects.all() # Obtener todos los departamentos
    serializer_class = DepartmentSerializer # Usar el serializador de Department
    
    
# ------------------------- User CRUD -------------------------

# class UserPagination(PageNumberPagination):
#     page_size = 8  # El número de usuarios por página (alínealo con React)
#     page_size_query_param = 'page_size'
#     max_page_size = 100

# class UserListView(APIView):
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated, IsAdminUser]
#     pagination_class = UserPagination

#     def get(self, request):
#         search_query = request.GET.get('search', '')  # Obtén el query de búsqueda
#         users = User.objects.filter(
#             Q(is_superuser=False, is_staff=False),  # Excluye superusers y staff
#             Q(username__icontains=search_query) | Q(email__icontains=search_query)  # Filtro de búsqueda
#         )

#         # Paginación
#         paginator = UserPagination()
#         result_page = paginator.paginate_queryset(users, request)
#         serializer = self.serializer_class(result_page, many=True)
#         return paginator.get_paginated_response(serializer.data)


