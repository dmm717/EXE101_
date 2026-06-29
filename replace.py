import codecs
with codecs.open('report.html', 'r', 'utf-8') as f:
    content = f.read()

content = content.replace('href="roadmap.html"', 'href="#"')

with codecs.open('report.html', 'w', 'utf-8') as f:
    f.write(content)
