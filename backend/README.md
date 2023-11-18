SDS Manager API
-----

#### This app is made for demo of how the SDS Manager API can be used to search for Safety Data Sheets in database with 13million+ SDS and retrieve extracted data for any SDS The API is also allowing you to upload a PDF of an Safety Data Sheet in any of 25 most used languages and retrieve a JSON of the extracted data from the SDS. The API is not free to use and require a subscription and an API key. Contact api_support_desk (at) mail.sdsmanager.com if you like to try the API for your company. Only user with company email will be give access. You can see a live version of this demo app on our web site on https://sdsmanager.com/us/sds-parser-api/

## Installation 
You can install and run backend application

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
create .env file in app/ and fill in required variables
```
-----



# Usage
Open http://127.0.0.1:8000/docs to check application API documention
