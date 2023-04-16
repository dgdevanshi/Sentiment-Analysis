from bs4 import BeautifulSoup
import requests as req
import sys
import json

url = sys.argv[1]

result = req.get(url)
content = result.text
soup = BeautifulSoup(content, 'lxml')
title = soup.title.string

json_str = json.dumps(title)
sys.stdout.write(json_str)
sys.stdout.flush()