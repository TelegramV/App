from json import load
import struct
import sys

version=sys.argv[1]

class DataStream(bytearray):
    def append(self, v, fmt='<B'):
        self.extend(struct.pack(fmt, v))

    def writeString(self, value):
        b = bytes(value, "ascii")
        if len(b) > 254:
            print("ERROR!!!", value)
        x.append(len(b))
        x.append(b, f'{len(b)}s')


x = DataStream()
f = open(f"schema_combine_{version}.json", "r")
j = load(f)
c_len = len(j["constructors"])
m_len = len(j["methods"])
x.append(c_len, '<I')
print(c_len, m_len)

for c in j["constructors"]:
    id = int(c["id"])
    if id < 0:
        id = id & 0xffffffff
    x.append(id, '<I')
    x.writeString(c["predicate"])
    x.writeString(c["type"])
    x.append(len(c["params"]))
    for i in c["params"]:
        x.writeString(i["name"])
        x.writeString(i["type"])

x.append(m_len, '<I')

for c in j["methods"]:
    id = int(c["id"])
    if id < 0:
        id = id & 0xffffffff
    x.append(id, '<I')
    x.writeString(c["method"])
    x.writeString(c["type"])
    x.append(len(c["params"]))
    for i in c["params"]:
        x.writeString(i["name"])
        x.writeString(i["type"])
# print(x)
file = open(f"../public/static/schema{version}.dat", "wb")
file.write(x)
