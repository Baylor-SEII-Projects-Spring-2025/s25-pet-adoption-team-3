import requests

def main():
    endpoint = "http://localhost:8080/api/pet/add-characteristics"
    personalitiesFileName = "personalities.txt"
    physicalCharacteristicsFileName = "physical-characteristics.txt"

    request = endpoint + "?"
    
    fPersonalities = open(personalitiesFileName, "r")
    fPhysicalChars = open(physicalCharacteristicsFileName, "r")

    personalities = fPersonalities.read()
    personalities = personalities.split("\n")
    physicalChars = fPhysicalChars.read()
    physicalChars = physicalChars.split("\n")
    
    fPersonalities.close()
    fPhysicalChars.close()

    first = True
    for i in personalities:
        if first:
            request += "c=" + i
            first = False
        else:
            request += "&c=" + i

    for i in physicalChars:
        request += "&c=" + i
    print(request)
    requests.post(request)

    

if __name__ == "__main__":
    main()
