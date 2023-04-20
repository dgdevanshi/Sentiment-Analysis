import requests
from bs4 import BeautifulSoup
import sys
import json

q = str(sys.stdin.readline()) + " stock share news"
# q = "lic stock share news"
url = f"https://www.google.com/search?q={q}&start=0"

response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")

news = ["livemint.com", "zeebiz.com"] 
        # "business-standard.com", "thehindubusinessline.com", "thehindu.com", 
        # "indianexpress.com", "ndtv.com", "businessinsider.in", "financialexpress.com"]

links = {}
for i in news :
    links[i] = []

for anchor in soup.find_all("a"):
    link = anchor.get("href")
    for i in news :
        if link and i in link:
            l = link[7:]
            if i=="livemint.com" :
                html_index = l.find(".html")
                l = l[:html_index + 5]
            if i=="zeebiz.com" :
                and_index = l.find("&")
                l = l[:and_index]
            links[i].append(l)


json_str = json.dumps(links)
sys.stdout.write(json_str)
sys.stdout.flush()