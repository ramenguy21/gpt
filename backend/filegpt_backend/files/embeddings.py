import openai
import os
from dotenv import load_dotenv
# import openai.embeddings_utils

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def create_embeddings(text):
    e = openai.Embedding.create(input=text, model="text-embedding-ada-002")
    return e.data[0].embedding