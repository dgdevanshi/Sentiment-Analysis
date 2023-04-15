import pandas as pd
import string
import re
import nltk
from nltk import word_tokenize
# nltk.download("stopwords")
# nltk.download("wordnet")
# nltk.download("punkt")

df = pd.read_csv("train.csv")
df.dropna(inplace=True)
df.drop(columns=["textID", "selected_text"], axis=1, inplace=True)
class_map = {"negative":0, "neutral":1, "positive":2}
df["sentiment"] = df["sentiment"].map(class_map)
ROWS = df.shape[0]

def caseLower(text) :
    text = text.lower()
    return text

def punctuationRemove(text) :
    text = "".join([char for char in text if char not in string.punctuation])
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub("[0-9]+", "", text)
    return text

def tokenization(text) :
    text = text.strip()
    text = re.split("\W+", text)
    return text

def singlesRemove(text) :
    text = [word for word in text if len(word) > 1]
    return text

def stopwordsRemove(text) :
    stopword = nltk.corpus.stopwords.words("english")
    text = [word for word in text if word not in stopword]
    return text

def lemmatizer(text) :
    text = [nltk.WordNetLemmatizer().lemmatize(word) for word in text]
    return text

def preprocess(text) :
    text = caseLower(text)
    text = punctuationRemove(text)
    text = tokenization(text)
    text = singlesRemove(text)
    text = stopwordsRemove(text)
    text = lemmatizer(text)
    text = " ".join(text)
    return text

df["text"] = df["text"].apply(lambda x: preprocess(x))

vocab = set()
for index, row in df.iterrows():
    words = row['text'].split()
    vocab.update(words)
print(vocab)
