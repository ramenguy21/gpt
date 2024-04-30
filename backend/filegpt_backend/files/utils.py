import re

def remove_non_ascii(text):
    # Use a regular expression to replace non-ASCII characters with an empty string
    return re.sub(r'[^\x00-\x7F]', '', text)