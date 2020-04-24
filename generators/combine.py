from json import loads
from json import dumps
import sys

version=sys.argv[1]

s = open(f"schema_{version}.json", "r").read()
s2 = open("schema_mtproto_v2.json", "r").read()
j = loads(s)
j2 = loads(s2)

for i in j2["constructors"]:
	j["constructors"].append(i)

for i in j2["methods"]:
	j["methods"].append(i)

out = open(f"schema_combine_{version}.json", "w")
out.write(dumps(j))
