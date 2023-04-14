import requests
from bs4 import BeautifulSoup
import sys

q = str(sys.stdin.readline()) + " stock share news"

url = f"https://www.google.com/search?q={q}&start=0"
links = set()

response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")

links = []
for anchor in soup.find_all("a"):
    link = anchor.get("href")
    if link and "moneycontrol.com" in link:
        links.append(link)
print(links)

links = str(links)
sys.stdout.write(links)
sys.stdout.flush()