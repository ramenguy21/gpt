import os
from dotenv import load_dotenv
from pinecone import Pinecone
import openai
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_pinecone import PineconeVectorStore
from langchain.chains.question_answering import load_qa_chain
# from langchain_community.chat_models import ChatOpenAI
from langchain_community.callbacks import get_openai_callback

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
pinecone_index_name=os.getenv('PINECONE_DB_INDEX')


def similarity_search(question, file_key):
    embeddings = OpenAIEmbeddings()
    vectorstore = PineconeVectorStore(
        index_name=pinecone_index_name,
        embedding=embeddings,
        namespace=file_key
    )
    response = vectorstore.similarity_search(query=question)
    return response


def process_question(question, file_key):
    docs = similarity_search(question, file_key)

    llm = ChatOpenAI()
    chain = load_qa_chain(llm, chain_type="stuff")
    with get_openai_callback() as cb:
        response = chain.run(input_documents=docs, question=question)
        print(cb)
    
    return response

