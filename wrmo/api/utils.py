import string
import random
from .models import *


def generate_unique_code():
    length = 18

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if not ProjectRoom.objects.filter(code=code).exists():
            break

    return code