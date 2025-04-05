import requests


def main():
    endpoint = "http://localhost:8080/api/pet/add-characteristics"
    physicalCharacteristicsFileName = "physical-characteristics.txt"

    request = endpoint + "?"

    fPhysicalChars = open(physicalCharacteristicsFileName, "r")

    physicalChars = fPhysicalChars.read()
    physicalChars = physicalChars.split("\n")

    fPhysicalChars.close()

    for i in physicalChars:
        request += "&c=" + i
    print(request)
    requests.post(request)



if __name__ == "__main__":
    main()
