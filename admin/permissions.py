from rest_framework import permissions

# Permiso de verificar si el usuario tiene permiso para realizar operaciones en sus datos, si solamente lee o puede modificar
class IsUserOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Si el método de solicitud es uno de los métodos seguros (GET, HEAD, OPTIONS), se permite
        if request.method in permissions.SAFE_METHODS:
            return True
        # Si la solicitud es un método que modifica el objeto (por ejemplo, PUT, PATCH, DELETE),
        # se verifica si el objeto es el mismo que el usuario que realiza la solicitud
        return obj == request.user
