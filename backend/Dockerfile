# Use an official Python runtime as a parent image
FROM python:3.10

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /code

# Copy the dependencies file to the working directory
COPY poetry.lock pyproject.toml /code/

# Install tesseract
RUN apt update && apt install -y tesseract-ocr && apt install -y libtesseract-dev

# Install Poetry and dependencies
RUN pip install poetry && poetry install --no-root --no-dev

# Copy the current directory contents into the container at /code
COPY . /code/

# Expose both port 8080 for HTTP and port 443 for HTTPS
EXPOSE 8080

# Run the Django development server
CMD ["poetry", "run", "python3", "filegpt_backend/manage.py", "runserver", "0.0.0.0:8080"]