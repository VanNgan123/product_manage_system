from rest_framework import status
from rest_framework.response import Response


def success_response(
    message="Thành công.",
    data=None,
    status_code=status.HTTP_200_OK,
    **extra,
):
    response_data = {
        "success": True,
        "message": message,
    }

    if data is not None:
        response_data["data"] = data

    response_data.update(extra)
    return Response(response_data, status=status_code)


def error_response(
    message="Có lỗi xảy ra.",
    errors=None,
    status_code=status.HTTP_400_BAD_REQUEST,
):
    response_data = {
        "success": False,
        "message": message,
    }

    if errors is not None:
        response_data["errors"] = errors

    return Response(response_data, status=status_code)
