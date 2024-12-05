from rest_framework import serializers
from .models import *

class CommentSerializer(serializers.ModelSerializer):

    user = serializers.ReadOnlyField(source='user.name')
    userlastname = serializers.ReadOnlyField(source='user.last_name')
    degree_id = serializers.ReadOnlyField(source='user.degree.id')
    degree_name = serializers.ReadOnlyField(source='user.degree.name_depart')
    avatar = serializers.ReadOnlyField(source='user.avatar.url')

    class Meta:
        model = Comment
        fields = '__all__'

    def get_avatar(self, obj):
        return obj.user.avatar.url
    
class MyPublicationSerializer(serializers.ModelSerializer):

    user = serializers.ReadOnlyField(source='user.name')
    userlastname = serializers.ReadOnlyField(source='user.last_name')
    degree_id = serializers.ReadOnlyField(source='user.degree.id')
    degree_name = serializers.ReadOnlyField(source='user.degree.name_depart')
    avatar = serializers.ReadOnlyField(source='user.avatar.url')

    likes_count = serializers.SerializerMethodField(read_only=True)
    iliked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Publication
        fields = ['id', 'user', 'userlastname', 'degree_id', 'degree_name',
                  'avatar', 
                  'content', 
                  'image', 'liked', 'created_at', 'likes_count', 'iliked', 'parent']
        
    def get_avatar(self, obj):
        return obj.user.avatar.url

    def get_likes_count(self, obj):
        return obj.liked.all().count()
    
    # Devuelve verdadero si ya le dimos like y falso si no le dimos.
    def get_iliked(self, obj):
        return True if self.context['request'].user in obj.liked.all() else False

class PublicationSerializer(serializers.ModelSerializer):

    user = serializers.ReadOnlyField(source='user.name')
    userlastname = serializers.ReadOnlyField(source='user.last_name')
    degree_id = serializers.ReadOnlyField(source='user.degree.id')
    degree_name = serializers.ReadOnlyField(source='user.degree.name_depart')
    avatar = serializers.ReadOnlyField(source='user.avatar.url')

    likes_count = serializers.SerializerMethodField(read_only=True)
    iliked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Publication
        fields = ['id', 'user', 'userlastname', 'degree_id', 'degree_name',
                  'avatar', 
                  'content', 
                  'image', 'liked', 'created_at', 'likes_count', 'iliked', 'parent']

    def get_avatar(self, obj):
        return obj.user.avatar.url
    
    def get_likes_count(self, obj):
        return obj.liked.all().count()
    
    def get_iliked(self, obj):
        return True if self.context['request'].user in obj.liked.all() else False