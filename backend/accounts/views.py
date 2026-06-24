from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import GenericAPIView

from utils.responses import error_response, success_response

from .serializers import RegisterSerializer, UserProfileSerializer


class RegisterView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return error_response(
                message="Đăng ký tài khoản thất bại.",
                errors=serializer.errors,
            )

        user = serializer.save()
        return success_response(
            message="Đăng ký tài khoản thành công.",
            data=UserProfileSerializer(user).data,
            status_code=status.HTTP_201_CREATED,
        )


class MeView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get(self, request):
        return success_response(
            message="Lấy thông tin người dùng thành công.",
            data=UserProfileSerializer(request.user).data,
        )
