#!/usr/bin/env python3
"""Adds the CMQ/OE practice-test set (50 items drawn from the self-assessment bank by
exam weight) to index.html, and updates the practice-test wording and the New: link.
Run: python3 patch_index_cmqoe.py <site root>"""
import sys, os, json
root=sys.argv[1]; p=os.path.join(root,'index.html')
t=open(p,encoding='utf-8').read()
HERE=os.path.dirname(os.path.abspath(__file__))
bank=json.load(open(os.path.join(HERE,'assess_data','cmqoe.json'),encoding='utf-8'))['bank']
TAKE={'I':8,'II':7,'III':8,'IV':10,'V':7,'VI':6,'VII':4}
pick=[]
for sec,n in TAKE.items():
    items=[b for b in bank if b[0].split('.')[0]==sec]
    codes=list(dict.fromkeys(b[0] for b in items))
    # spread over requirements: first unused item of each requirement in turn, evenly spaced
    step=len(codes)/n
    chosen=[codes[int(i*step)] for i in range(n)]
    for c in chosen: pick.append(next(b for b in items if b[0]==c and b not in pick))
assert len(pick)==50 and len({b[1] for b in pick})==50
def rep(a,b):
    global t
    assert t.count(a)==1,(a[:60],t.count(a)); t=t.replace(a,b)
rep('"cmqoe": [], ', '"cmqoe": '+json.dumps(pick,ensure_ascii=False)+', ')
rep('350 original items across seven certifications, with three more in preparation,','400 original items across eight certifications, with two more in preparation,')
rep('350 original items across ten certifications,','400 original items across eight certifications,')
rep('<b style="color:var(--navy)">New:</b> <a href="/assessment/six-sigma-yellow-belt.html">Yellow Belt self-assessment by BoK requirement</a>. It tests all 42 requirements, shows where you stand on each one, and tracks your progress over time.',
    '<b style="color:var(--navy)">New:</b> self-assessments by BoK requirement for <a href="/assessment/six-sigma-yellow-belt.html">Six Sigma Yellow Belt</a> (42 requirements) and <a href="/assessment/manager-of-quality-organizational-excellence.html">CMQ/OE</a> (82 requirements, 2026 BoK). Each shows where you stand on every requirement and tracks your progress over time.')
open(p,'w',encoding='utf-8',newline='').write(t)
print('cmqoe practice set', len(pick))
