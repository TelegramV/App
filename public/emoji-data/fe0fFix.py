#https://www.jsdelivr.com/package/npm/emoji-datasource-apple
import os
from os import path

def main():
    os.chdir("./img-apple-64")
    directory = os.fsencode(".")

    for file in os.listdir(directory):
         filename = os.fsdecode(file)
         if filename.endswith("-fe0f.png"):
            if len(filename.split("-")) <= 2:
                os.rename(path.abspath(filename),path.abspath(filename.replace("-fe0f.png",".png")))
                print("Renamed: "+filename); 
         else:
             continue
    
if __name__ == "__main__":
    main()