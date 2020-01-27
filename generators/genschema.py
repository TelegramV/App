from binascii import crc32

spaces = " " * 4
scheme_files = ["mtproto", "api"]

def parseType(t):
	if t[0] == "%":
		t = t[1:]
	if t == "true":
		return ("boolean", False)
	if t == "long":
		# TODO BigInteger
		return ("string | number[] | Uint8Array", False)
	if t == "int" or t == "double":
		return ("number", False)
	if t.lower().startswith("vector<"):
		return ("Array<" + parseType(t.split("<")[1][:-1])[0] + ">", False)
	if t == "bytes" or t == "int128" or t == "int256" or t == "int512":
		return ("Uint8Array | number[]", False)
	if t.startswith("flags."):
		return (parseType(t.split("?")[1])[0], True)
	return (t, False)

def generate_for_schema(schema):
	code = ""
	kv = {}
	for i in schema:
		if i.startswith("//"):
			continue
		if i == "---functions---":
			break
		g = i.split(" ")
		if "#" in g[0]:
			g[0] = g[0].split("#")[0]
		i = " ".join(g)
		crc = crc32(i.encode("ascii"))
		# print(hex(crc & 0xffffffff))

		s, v = map(str.strip, i.split("="))
		v = v.replace(".", "__")
		k = s.split(" ")
		k[0] = k[0].replace(".", "__")

		if k[-1] in ["?", "]"]:
			continue
		if v not in kv:
			kv[v] = [k[0]]
		else:
			kv[v].append(k[0])
		code += f"export type {k[0]} = {{\n"
		for j in k[1:]:
			n, t = j.split(":")
			if t == "#":
				continue
			t, o = parseType(t)
			code += f"{spaces}{n}{'?' if o else ''}: {t.replace('.', '__')},\n"
		code += "}\n\n"
	for i in kv:
		code += f"type {i} = {' | '.join(kv[i])}\n"
	return code


for i in scheme_files:
	f = open(i + ".tl", "r")
	code = generate_for_schema(filter(len, map(lambda x: x.rstrip(";"), map(str.strip, f.read().replace("\r", "").split("\n")))))
	f.close()
	f = open(i + ".js", "w")
	f.write(code)
	f.close()
	print(code)
