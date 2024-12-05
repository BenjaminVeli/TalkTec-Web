from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.generics import ListAPIView

from . models import *
from users.models import User
from . serializers import *
from .permissions import IsUserOrReadOnly
from backend.pagination import CustomPagination

# Ve, actualiza y elimina un comentario en específico
class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsUserOrReadOnly]

# Lista y crea comentarios relacionados con una publicación
class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    # Método para obtener una publicación específica
    def get_object(self, pk):
        publication = Publication.objects.get(pk=pk)
        return publication
    
    # Método para obtener y listar comentarios relacionados con una publicación
    def get(self, request, pk):
        publication = self.get_object(pk)
        comments = Comment.objects.filter(publication=publication)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    # Método para crear un nuevo comentario relacionado con una publicación
    def create(self, request, pk):
        publication = self.get_object(pk)
        data = request.data
        comment = Comment(
            user=request.user,
            body=data['body'],
            publication=publication
        )
        comment.save()
        serializer = CommentSerializer(comment, many=False)
        return Response(serializer.data)

# Vista para obtener las publicaciones que le gustan a un usuario específico
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_likes(request, name):
    user = User.objects.get(name=name)
    publications = Publication.objects.filter(liked=user)
    serializer = MyPublicationSerializer(publications, many=True, context={'request': request})
    return Response(serializer.data)

# Vista para manejar la acción de dar o quitar un "like" a una publicación
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like(request, pk):
    publication = Publication.objects.get(pk=pk)
    if request.user in publication.liked.all():
        publication.liked.remove(request.user)
    else:
        publication.liked.add(request.user)
    return Response({'status': 'ok'})

# Vista para obtener las publicaciones de un usuario específico
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_publications(request, name):
    user = User.objects.get(name=name)
    publications = Publication.objects.filter(user=user)
    serializer = MyPublicationSerializer(publications, many=True, context={'request': request})
    return Response(serializer.data)

# Lista y crear las publicaciones
class PublicationList(generics.ListCreateAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    # Le asignamos el usuario autenticado cuando cree una nueva publicación
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Ver, actualizar y eliminar la publicación individualmente
class PublicationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated, IsUserOrReadOnly]

# Filtra las publicaciones por el ID de la carrera
class FilterDegree(ListAPIView):
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated, IsUserOrReadOnly]

    # Método para obtener las publicaciones relacionadas con una carrera específica
    def get_queryset(self):
        degree_id = self.kwargs['pk']
        return Publication.objects.filter(user__degree__id=degree_id)