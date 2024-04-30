

from PyPDF2 import PdfReader
from django.shortcuts import get_object_or_404
from langchain.text_splitter import CharacterTextSplitter
from langchain.schema import Document
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings

from .embeddings import create_embeddings
from .models import UploadedFile
import os
from dotenv import load_dotenv
from pinecone import Pinecone
from PIL import Image
from pytesseract import image_to_string
from boto3 import client
from tempfile import TemporaryDirectory


load_dotenv()
# s3 = client('s3', os.getenv('AWS_ACCESS_KEY_ID'), os.getenv('AWS_SECRET_ACCESS_KEY'))
s3 = client('s3')
s3_bucket = os.getenv('AWS_STORAGE_BUCKET_NAME')
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
pinecone_index_name=os.getenv('PINECONE_DB_INDEX')


def create_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
      )
    chunks = text_splitter.split_text(text)

    return chunks

def process_pdf(pdf_url):
    with open(pdf_url, 'rb') as file:
        pdf_reader = PdfReader(file)
        text = ""
        for page in pdf_reader.pages:                
            text += page.extract_text()
        return text
    
def process_image(img_url):
    return image_to_string(Image.open(img_url))

def download_file_from_s3(s3_key):
    with TemporaryDirectory() as temp_dir:
        local_file_path = os.path.join(temp_dir, 'temp_file')
        # local_file_path = "/media"

        s3.download_file(s3_bucket, s3_key, local_file_path)

        if s3_key.lower().endswith('.pdf'):
            pdf_text = process_pdf(local_file_path)
            return pdf_text
        elif s3_key.lower().endswith(('.jpg', '.jpeg', '.png')):
            image_text = process_image(local_file_path)
            return image_text
        else:
            print("Unsupported file format")

def process_file(file_id):
    file_obj = get_object_or_404(UploadedFile, pk=file_id)
    file_key = str(file_obj.file)
    
    print("\n DONWLOADING FILE FROM S3 ...\n")
    text = download_file_from_s3(file_key)

    print("\n CREATING CHUNKS/DOCS ...\n")
    chunks = create_chunks(text)

    print("\n CREATING EMBEDDINGS AND STORING IN PINECONE ...\n")
    embeddings = OpenAIEmbeddings()

    PineconeVectorStore.from_texts(
        chunks,
        index_name=pinecone_index_name,
        namespace=file_key,
        embedding=embeddings
    )
