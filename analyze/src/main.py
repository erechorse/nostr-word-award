import re

from pyknp import Juman


def preprocess(df, authors):
    output = df[~df['author'].isin(authors)]
    url_pattern = r'(https?)(:\/\/[-_\.!~*\'()a-zA-Z0-9;\/?:\@&=\+\$,%#]+)'
    nostr_pattern = r'nostr:\w+\s'
    output['content'] = df['content'].apply(
        lambda x: re.sub(f'{url_pattern}|{nostr_pattern}', '', x))
    return output


def analyze(df):
    jumanpp = Juman()
    result = [
        jumanpp.analysis(content) for content in df['content']
    ]
    return result
