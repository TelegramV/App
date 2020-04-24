import struct
import json
import sys

version=sys.argv[1]

f = open(f"schema_{version}.tl", "r")
mode = "constructors"
modePredicate = "predicate"
j = {
	"constructors": [],
	"methods": []
}
for q in f:
	i = q.strip()
	if i == "---functions---":
		mode = "methods"
		modePredicate = "method"
		continue
	if len(i) == 0:
		continue
	z = i.split(" ")
	name, id = z[0].split("#")
	while len(id) < 8:
		id = "0" + id
	type = z[-1][:-1]
	params = [{
		"name": i.split(":")[0],
		"type": i.split(":")[1]
	} for i in z[1:-2]]
	j[mode].append({
		"id": struct.unpack('>i', bytes.fromhex(id))[0],
		modePredicate: name,
		"params": params,
		"type": type
	})
out = open(f"schema_{version}.json", "w")
out.write(json.dumps(j, indent=4))
print(j)
