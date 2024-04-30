FROM python:3.11.5-slim-bookworm

ENV  \
    PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    # Poetry's configuration:
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_CACHE_DIR='/var/cache/pypoetry' \
    POETRY_HOME='/usr/local' \
    POETRY_VERSION=1.8.0
# ^^^
# Make sure to update it!

# System deps:
RUN apt-get update && apt-get upgrade -y \
    && apt-get install --no-install-recommends -y \
    bash \
    brotli \
    build-essential \
    curl \
    gettext \
    git \
    libpq-dev \
    wait-for-it \
    # Installing `tini` utility:
    # https://github.com/krallin/tini
    # Get architecture to download appropriate tini release:
    # See https://github.com/wemake-services/wemake-django-template/issues/1725
    && dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')" \
    # Installing `poetry` package manager:
    # https://github.com/python-poetry/poetry
    && curl -sSL 'https://install.python-poetry.org' | python - \
    && poetry --version \
    # Cleaning cache:
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*


# Copy only requirements to cache them in docker layer
WORKDIR /code
COPY poetry.lock pyproject.toml /code/

# Project initialization:
RUN poetry install --no-interaction --no-ansi

# Creating folders, and files for a project:
COPY . /code

# Set the working directory in the container
WORKDIR /code

# Copy the dependencies file to the working directory
COPY pyproject.toml /code/

# Install tesseract
RUN apt update && apt install -y tesseract-ocr && apt install -y libtesseract-dev

# Expose both port 8080 for HTTP and port 443 for HTTPS
EXPOSE 8080

# Run the Django development server
CMD ["poetry", "run", "python3", "filegpt_backend/manage.py", "runserver", "0.0.0.0:8080"]