### TECSUPNET

Social network for Tecsup students

### Crear entorno virtual :

```sh
python -m venv env
.\env\Scripts\activate
```

### Initialize Backend :

```sh
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```


### Initialize Frontend :

```sh
cd frontend
npm i
npm run dev
```