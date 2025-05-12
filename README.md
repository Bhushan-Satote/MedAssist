Chatbord Run Command 

python -m venv venv

venv\Scripts\activate

pip install uvicorn

pip install fastapi

pip install pdfplumber

pip install fastapi uvicorn google-generativeai

uvicorn main:app --reload --host 0.0.0.0 --port 8001

