from json import loads
from json import dumps

s = open("schema_api.json", "r").read()
s2 = open("schema.json", "r").read()
j = loads(s)
j2 = loads(s2)

for i in j2["constructors"]:
	j["constructors"].append(i)

for i in j2["methods"]:
	j["methods"].append(i)

out = open("schema_new.json", "w")
out.write(dumps(j))
