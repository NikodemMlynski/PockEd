from pydantic import BaseModel
from typing import Optional, List, Dict

class ChatIn(BaseModel):

    messages: List[Dict[str , str]] #{"role": "user", "content": user_message}


class ChatOut(BaseModel):
    messages: List[Dict[str , str]] #{"role": "user", "content": user_message}
