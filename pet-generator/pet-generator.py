import random
import time
import requests
from datetime import datetime
import json

def addPet(endpoint, petDict):
    response = requests.post(endpoint, json = petDict)
    print("Pet Added", petDict)
    
def randomDateBetween(start_date, end_date):
    start_time = time.mktime(datetime.strptime(start_date, "%Y-%m-%d").timetuple())
    end_time = time.mktime(datetime.strptime(end_date, "%Y-%m-%d").timetuple())

    random_time = start_time + random.random() * (end_time - start_time)
    return datetime.fromtimestamp(random_time).strftime("%Y-%m-%d")

# Refine in the future to match the breed, for now it randomly generates characteristics
def generateCharacteristics(personalities, physicalChars):
    numPersonalities = 3
    numPhysicalChars = 3
    output = []
    
    # Prevents duplicates
    personalitiesIdx = random.sample(range(0, len(personalities)), numPersonalities)
    physicalCharsIdx = random.sample(range(0, len(physicalChars)), numPhysicalChars)

    '''print("Generated personalities index: ", personalitiesIdx)
    print("Generated physicalChars index: ", physicalCharsIdx)

    print(len(personalities))
    print(len(physicalChars))'''
    
    for i in range(numPersonalities):
        output.append({"id": personalitiesIdx[i] + 1, "name": personalities[personalitiesIdx[i]]})
    for i in range(numPersonalities):
        output.append({"id": physicalCharsIdx[i] + 1, "name": physicalChars[physicalCharsIdx[i]]})

    return output
        

def main():
    NUMBER_TO_GENERATE = 30
    endpoint = "http://localhost:8080/api/pet/add-pet"

    minDate = "2017-01-01"
    maxDate = "2024-12-30"

    fDogBreeds = open("dog-breeds.txt", "r")
    fMaleDogNames = open("male-dog-names.txt", "r")
    fFemaleDogNames = open("female-dog-names.txt", "r")
    fPersonalities = open("personalities.txt", "r")
    fPhysicalChars = open("physical-characteristics.txt", "r")

    dogBreeds = fDogBreeds.read().split("\n")

    maleDogNames = fMaleDogNames.read().split("\n")

    femaleDogNames = fFemaleDogNames.read().split("\n")

    personalities = fPersonalities.read().split("\n")

    physicalChars = fPhysicalChars.read().split("\n")
    
    fDogBreeds.close()
    fMaleDogNames.close()
    fFemaleDogNames.close()
    fPersonalities.close()
    fPhysicalChars.close()

    spayedStatusArray = ["Neutered Male", "Unneutered Male", "Spayed Female", "Unspayed Female"]

    for i in range(NUMBER_TO_GENERATE):
        status = random.randint(0,3)
        breed = dogBreeds[random.randint(0, len(dogBreeds)-1)]
        spayedStatus = spayedStatusArray[status]
        dogName = ''
        birthDate = randomDateBetween(minDate, maxDate) 
        
        if status <= 1:
            dogName = maleDogNames[random.randint(0, len(maleDogNames)-1)]
        else:
            dogName = femaleDogNames[random.randint(0, len(femaleDogNames)-1)]

        characteristics = generateCharacteristics(personalities, physicalChars)
        
        addPet(endpoint, {
                "name": dogName,
                "breed": breed,
                "spayedStatus": spayedStatus,
                "birthdate": birthDate,
                "aboutMe": "n/a",
                "extra1": "n/a",
                "extra2": "n/a",
                "extra3": "n/a",
                "characteristics": characteristics,
                "availabilityStatus": 'AVAILABLE'
            })


if __name__ == "__main__":
    main()
