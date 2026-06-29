import codecs
import re

with codecs.open('js/common.js', 'r', 'utf-8') as f:
    content = f.read()

old_func = "const cleanText = (el) => (el?.innerText || '').replace(/\\s+/g, ' ').trim();"
new_func = """const cleanText = (el) => {
        if (!el) return '';
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.material-symbols-outlined, .material-icons').forEach(i => i.remove());
        return (clone.textContent || '').replace(/\\s+/g, ' ').trim();
    };"""

if old_func in content:
    content = content.replace(old_func, new_func)
    with codecs.open('js/common.js', 'w', 'utf-8') as f:
        f.write(content)
    print("Replaced successfully.")
else:
    print("Could not find the target string in common.js.")
