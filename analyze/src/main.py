import datetime
import re

from pyknp import Juman


def preprocess(df, authors):
    output = df[~df['author'].isin(authors)]
    url_pattern = r'(https?)(:\/\/[-_\.!~*\'()a-zA-Z0-9;\/?:\@&=\+\$,%#]+)'
    nostr_pattern = r'nostr:\w+\s'
    output['content'] = df['content'].apply(
        lambda x: re.sub(f'{url_pattern}|{nostr_pattern}', '', x))
    return output


def monthly_index(df):
    outputs = {i: [] for i in range(2, 13)}
    for _, row in df.iterrows():
        date = datetime.datetime.fromtimestamp(row['created_at'])
        outputs[date.month].append(row['content'])
    return outputs


def analyze(df):
    jumanpp = Juman()
    result = [
        jumanpp.analysis(content) for content in df['content']
    ]
    return result
