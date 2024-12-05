from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from rest_framework.response import Response
from django.db.models import Count, Q
from users.models import User
from publications.models import Publication, Department, Comment
from . serializers import *
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from django.db.models.functions import TruncMonth

# ------------------------ User CRUD ------------------------

class UserPagination(PageNumberPagination):
    page_size = 6  # El número de usuarios por página (alínealo con React)
    page_size_query_param = 'page_size'
    max_page_size = 100
    

class UserList(generics.ListAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = UserPagination
    
    def get(self, request):
        search_query = request.GET.get('search', '')  # Query de búsqueda
        users = User.objects.filter(
            Q(is_superuser=False, is_staff=False),
            Q(name__icontains=search_query) | Q(last_name__icontains=search_query)
        )
        
        # Paginación
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(users, request)
        serializer = self.serializer_class(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

class UserListUpdate(generics.UpdateAPIView):
    queryset = User.objects.all()  # Define el conjunto de datos a actualizar
    serializer_class = UserListSerializer  # Define el serializador
    permission_classes = [IsAuthenticated, IsAdminUser]  # Define permisos

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)  # Si deseas actualizaciones parciales (PATCH), define `partial=True`
        instance = self.get_object()  # Obtén la instancia del objeto que se va a actualizar
        serializer = self.get_serializer(instance, data=request.data, partial=partial)  # Valida los datos
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)  # Realiza la actualización
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        serializer.save()


# ------------------------ Publication CRUD ------------------------

class PublicationPagination(PageNumberPagination):
    page_size = 2  # Ajusta el número de publicaciones por página (alínealo con React)
    page_size_query_param = 'page_size'
    max_page_size = 100

class PublicationList(generics.ListAPIView):
    serializer_class = PublicationListSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = PublicationPagination

    def get(self, request):
        search_query = request.GET.get('search', '')  # Query de búsqueda
        publications = Publication.objects.filter(
            Q(content__icontains=search_query) 
        )
        
        # Paginación
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(publications, request)
        serializer = self.serializer_class(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

class PublicationListDelete(generics.DestroyAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationListSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    
    
class CommentPagination(PageNumberPagination):
    page_size = 2  # Ajusta el número de comentarios por página 
    page_size_query_param = 'page_size'
    max_page_size = 100
    
class PublicationCommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CommentPagination
    
    # Método para obtener una publicación específica
    def get_object(self, pk):
        publication = Publication.objects.get(pk=pk)
        return publication
    
    # Método para obtener y listar comentarios relacionados con una publicación
    def get(self, request, pk):
        publication = self.get_object(pk)
        comments = Comment.objects.filter(publication=publication)
        
        # Use pagination
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(comments, request)
        serializer = self.serializer_class(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    


# ------------------------ Reports ------------------------ 

class UserCountView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        active_users = User.objects.filter(is_active=True).count()  # Total de usuarios activos 
        deactive_users = User.objects.filter(is_active=False).count()  # Total de usuarios desactivados
        total_publications = Publication.objects.count()
        
        return Response({
            'active_users': active_users,
            'deactive_users': deactive_users,
            'total_publications': total_publications
        })

class WeeklyUserRegistrationsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_day_name(self, date):
        # Diccionario de equivalencias para días en español
        dias = {
            0: 'L',  # Lunes
            1: 'M',  # Martes
            2: 'M',  # Miércoles
            3: 'J',  # Jueves
            4: 'V',  # Viernes
            5: 'S',  # Sábado
            6: 'D'   # Domingo
        }
        return dias[date.weekday()]

    def get(self, request):
        today = timezone.now().date()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        
        users_this_week = User.objects.filter(
            date_joined__date__range=(start_of_week, end_of_week)
        )
        
        daily_counts = (
            users_this_week
            .extra(select={'day': 'DATE(date_joined)'})
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )

        # Convertir los resultados y añadir el nombre del día
        formatted_counts = []
        for item in daily_counts:
            date_obj = timezone.datetime.strptime(str(item['day']), '%Y-%m-%d').date()
            formatted_counts.append({
                'day': self.get_day_name(date_obj),  # Nombre abreviado del día
                'full_date': str(item['day']),       # Mantenemos la fecha completa por si la necesitas
                'count': item['count']
            })

        return Response({"weekly_user_registrations": formatted_counts})

class MounthlyPublicationsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request, *args, **kwargs):
        # Agregar la truncación de fecha por mes
        monthly_publications = (
            Publication.objects
            .filter(created_at__isnull=False)
            .values(month=TruncMonth('created_at'))  # Agrupar por mes
            .annotate(publication_count=Count('id'))  # Contar visitas por mes
            .order_by('month')  # Ordenar de más reciente a más antiguo
        )

        # Diccionario para mapear el número de mes al nombre del mes en español
        month_names = {
            1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun",
            7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic"
        }

        # Formato de respuesta con el nombre del mes en lugar de la fecha
        result = [
            {
                'month': month_names[month['month'].month],  # Obtiene el nombre abreviado del mes
                'publication_count': month['publication_count']
            }
            for month in monthly_publications
        ]

        return Response(result, status=status.HTTP_200_OK)

class DegreeStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser] 

    def get(self, request):
        specialties = Department.objects.all()
        
        # Modificación para reflejar el campo correcto
        stats = User.objects.values('degree__name_depart').annotate(total=Count('degree')).order_by('degree__name_depart')
        
        # Creación de diccionario con los resultados
        stats_dict = {stat['degree__name_depart']: stat['total'] for stat in stats}
        
        # Crear la lista final con los totales por especialidad
        all_stats = []
        for specialty in specialties:
            all_stats.append({
                'degree__name': specialty.name_depart,
                'total': stats_dict.get(specialty.name_depart, 0)
            })
        
        return Response(all_stats)
    
class WeeklyFiveComments(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_day_name(self, date):
        # Diccionario de equivalencias para días en español
        dias = {
            0: 'L',  # Lunes
            1: 'M',  # Martes
            2: 'M',  # Miércoles
            3: 'J',  # Jueves
            4: 'V',  # Viernes
            5: 'S',  # Sábado
            6: 'D'   # Domingo
        }
        return dias[date.weekday()]

    def get(self, request):
        today = timezone.now().date()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        
        comments_this_week = Comment.objects.filter(
            created_at__date__range=(start_of_week, end_of_week)
        )
        
        daily_counts = (
            comments_this_week
            .extra(select={'day': 'DATE(created_at)'})
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )

        # Convertir los resultados y añadir el nombre del día
        formatted_counts = []
        for item in daily_counts:
            date_obj = timezone.datetime.strptime(str(item['day']), '%Y-%m-%d').date()
            formatted_counts.append({
                'day': self.get_day_name(date_obj),  # Nombre abreviado del día
                'full_date': str(item['day']),       # Mantenemos la fecha completa por si la necesitas
                'count': item['count']
            })

        return Response({"weekly_comment_registrations": formatted_counts})
    
class TopFivePublicationsByComments(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # Obtener los 5 IDs de publicaciones con más comentarios
        top_five_comments = (
            Comment.objects
            .values('publication_id')  # Agrupar por el ID de la publicación
            .annotate(comment_count=Count('id'))  # Contar los comentarios por publicación
            .order_by('-comment_count')[:5]  # Obtener las 5 publicaciones con más comentarios
        )

        # Lista para almacenar los datos finales
        data = []
        
        # Iterar sobre las publicaciones para obtener el contenido y el nombre del autor
        for item in top_five_comments:
            publication = Publication.objects.get(id=item['publication_id'])
            author = publication.user  # Acceder al usuario que creó la publicación
            
            data.append({
                'author': f"{author.name} {author.last_name}",  # Nombre completo del autor
                'publication_content': publication.content,
                'comment_count': item['comment_count']  # Solo el conteo de comentarios
            })

        return Response({"top_five_publications_by_comments": data})
    
class TopTenPublicationsByLikes(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # Obtener publicaciones con al menos un like y ordenar las 10 con más likes
        top_ten_likes = (
            Publication.objects
            .annotate(like_count=Count('liked'))  # Anotar el número de likes
            .filter(like_count__gt=0)  # Filtrar solo publicaciones con más de 0 likes
            .order_by('-like_count')[:10]  # Ordenar por like_count en orden descendente y tomar las 10 primeras
        )

        # Construir los datos para la respuesta
        data = [
            {
                'author': f"{pub.user.name} {pub.user.last_name}",  # Nombre completo del autor
                'publication_content': pub.content,
                'like_count': pub.like_count  # Cantidad de likes
            }
            for pub in top_ten_likes
        ]

        return Response({"top_ten_publications_by_likes": data})

    
    