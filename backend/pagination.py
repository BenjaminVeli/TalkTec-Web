from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    # Configuración de la paginación
    page_size = 10
    page_size_query_param = 'page_size' # Parámetro para especificar el tamaño de página
    max_page_size = 10
    page_query_param = 'page' # Parámetro para especificar el número de página

    # La data son todas las publicaciones
    def get_paginated_response(self, data):
        return Response({
            'data': data,
            'meta': {
                'next': self.page.next_page_number() if self.page.has_next() else None,
                'previous': self.page.previous_page_number() if self.page.has_previous() else None,
                'count': self.page.paginator.count,
                }
        })