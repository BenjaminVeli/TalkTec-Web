from rest_framework import serializers
from users.models import User
from publications.models import Publication, Comment
from users.serializers import DepartmentSerializer

class UserListSerializer(serializers.ModelSerializer):
    date_joined = serializers.SerializerMethodField()
    degree = DepartmentSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ["id", "name", "last_name","email", "code","is_active","degree","date_joined"]
        
    def get_date_joined(self, obj):
        return obj.date_joined.strftime('%d/%m/%Y %H:%M')

class PublicationListSerializer(serializers.ModelSerializer):
    user = UserListSerializer(read_only=True)
    avatar = serializers.ReadOnlyField(source='user.avatar.url')
    likes_count = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Publication
        fields = ["id", "user","content", "image", "avatar","created_at",
                  "likes_count"]
    
    def get_likes_count(self, obj):
        return obj.liked.all().count()
    
    def get_avatar(self, obj):
        return obj.user.avatar.url

class CommentListSerializer(serializers.ModelSerializer):
    user = UserListSerializer(read_only=True)
    avatar = serializers.ReadOnlyField(source='user.avatar.url')
    
    class Meta:
        model = Comment
        fields = '__all__'

    def get_avatar(self, obj):
        return obj.user.avatar.url