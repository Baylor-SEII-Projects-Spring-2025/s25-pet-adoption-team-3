import fs from 'node:fs/promises'



const dogBreeds = [...`
('Toby', 1, 'Labrador', 'Neutered Male', '2022-11-29', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Molly', 1, 'Golden Retriever', 'Spayed Female', '2018-12-06', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Sadie', 1, 'German Shepherd', 'Unspayed Female', '2019-12-01', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Cooper', 1, 'Golden Retriever', 'Neutered Male', '2016-07-12', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Lily', 1, 'Golden Retriever', 'Unneutered Male', '2021-06-01', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Sadie', 1, 'Chihuahua', 'Unspayed Female', '2021-05-15', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Max', 1, 'Bulldog', 'Unspayed Female', '2021-03-10', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Bailey', 1, 'German Shepherd', 'Neutered Male', '2021-05-10', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Stella', 1, 'Chihuahua', 'Spayed Female', '2016-06-04', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Luna', 1, 'Chihuahua', 'Neutered Male', '2016-10-07', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Duke', 1, 'Labrador', 'Neutered Male', '2018-03-13', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Molly', 1, 'Golden Retriever', 'Unspayed Female', '2022-07-18', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Stella', 1, 'Shih Tzu', 'Spayed Female', '2018-08-31', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Buddy', 1, 'Golden Retriever', 'Unneutered Male', '2016-05-01', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Chloe', 1, 'Beagle', 'Spayed Female', '2023-08-06', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Bella', 1, 'Golden Retriever', 'Spayed Female', '2020-03-27', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Toby', 1, 'Chihuahua', 'Neutered Male', '2016-01-05', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Bella', 1, 'Dachshund', 'Spayed Female', '2021-12-07', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Bailey', 1, 'Shih Tzu', 'Unspayed Female', '2015-09-11', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Jack', 1, 'Labrador', 'Neutered Male', '2020-11-29', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Lily', 1, 'Beagle', 'Unspayed Female', '2016-06-30', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Bear', 1, 'German Shepherd', 'Neutered Male', '2021-01-23', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Toby', 1, 'Shih Tzu', 'Unneutered Male', '2023-02-14', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Daisy', 1, 'Beagle', 'Neutered Male', '2021-10-11', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Molly', 1, 'Bulldog', 'Spayed Female', '2020-12-30', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Duke', 1, 'Golden Retriever', 'Unspayed Female', '2017-05-30', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Bailey', 1, 'Beagle', 'Unspayed Female', '2021-06-20', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Rocky', 1, 'Boxer', 'Unspayed Female', '2015-06-08', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Rocky', 1, 'Poodle', 'Neutered Male', '2019-02-17', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Chloe', 1, 'Beagle', 'Spayed Female', '2015-01-13', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Cooper', 1, 'Bulldog', 'Neutered Male', '2017-04-07', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Buddy', 1, 'Labrador', 'Spayed Female', '2023-07-26', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Lily', 1, 'Poodle', 'Neutered Male', '2022-08-08', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Bailey', 1, 'German Shepherd', 'Unspayed Female', '2016-06-04', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Luna', 1, 'Labrador', 'Neutered Male', '2019-04-20', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Zeus', 1, 'Dachshund', 'Neutered Male', '2015-05-20', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Zeus', 1, 'Chihuahua', 'Neutered Male', '2017-02-15', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Bailey', 1, 'Boxer', 'Unneutered Male', '2018-06-01', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Chloe', 1, 'Bulldog', 'Neutered Male', '2022-12-02', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Bear', 1, 'German Shepherd', 'Unspayed Female', '2017-12-18', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Jack', 1, 'Golden Retriever', 'Spayed Female', '2020-05-01', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Duke', 1, 'Dachshund', 'Unneutered Male', '2023-06-29', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Daisy', 1, 'Beagle', 'Spayed Female', '2020-02-04', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Bear', 1, 'Beagle', 'Spayed Female', '2023-03-12', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Daisy', 1, 'Dachshund', 'Neutered Male', '2016-05-09', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Jack', 1, 'Poodle', 'Spayed Female', '2022-08-19', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Rocky', 1, 'Chihuahua', 'Unspayed Female', '2017-09-18', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Jack', 1, 'Dachshund', 'Spayed Female', '2017-04-22', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Buddy', 1, 'Poodle', 'Unneutered Male', '2015-02-28', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Luna', 1, 'Shih Tzu', 'Spayed Female', '2021-12-03', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Lily', 1, 'Poodle', 'Spayed Female', '2020-11-26', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Cooper', 1, 'Beagle', 'Spayed Female', '2019-09-16', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Jack', 1, 'Bulldog', 'Unspayed Female', '2023-05-01', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Jack', 1, 'Shih Tzu', 'Unspayed Female', '2023-04-15', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Toby', 1, 'Dachshund', 'Unspayed Female', '2018-03-16', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Toby', 1, 'Shih Tzu', 'Unneutered Male', '2015-05-17', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Charlie', 1, 'Boxer', 'Unneutered Male', '2023-05-26', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Daisy', 1, 'Bulldog', 'Neutered Male', '2023-04-26', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Duke', 1, 'German Shepherd', 'Spayed Female', '2022-03-23', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Molly', 1, 'Dachshund', 'Unspayed Female', '2019-06-16', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Cooper', 1, 'Labrador', 'Unspayed Female', '2015-11-10', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Max', 1, 'Labrador', 'Spayed Female', '2023-04-30', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Stella', 1, 'German Shepherd', 'Unneutered Male', '2020-01-11', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Bella', 1, 'Beagle', 'Unspayed Female', '2020-02-20', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Luna', 1, 'Beagle', 'Neutered Male', '2016-07-20', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Bailey', 1, 'Chihuahua', 'Unspayed Female', '2016-11-05', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Daisy', 1, 'Beagle', 'Unneutered Male', '2022-04-27', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Lily', 1, 'Beagle', 'Neutered Male', '2016-07-08', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Lily', 1, 'Golden Retriever', 'Unspayed Female', '2021-07-13', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Cooper', 1, 'Golden Retriever', 'Unneutered Male', '2017-12-12', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Bella', 1, 'Labrador', 'Unneutered Male', '2015-10-13', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Max', 1, 'Shih Tzu', 'Unspayed Female', '2020-07-16', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Chloe', 1, 'Beagle', 'Unspayed Female', '2018-02-16', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Buddy', 1, 'Dachshund', 'Unneutered Male', '2018-08-24', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Charlie', 1, 'German Shepherd', 'Unneutered Male', '2023-03-08', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Max', 1, 'Poodle', 'Unneutered Male', '2022-05-22', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Rocky', 1, 'Beagle', 'Unneutered Male', '2023-05-09', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Buddy', 1, 'Dachshund', 'Neutered Male', '2017-08-30', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Daisy', 1, 'Labrador', 'Unspayed Female', '2020-06-27', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Buddy', 1, 'Labrador', 'Unspayed Female', '2015-05-15', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Charlie', 1, 'Dachshund', 'Spayed Female', '2018-09-03', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Bella', 1, 'German Shepherd', 'Unspayed Female', '2021-09-27', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Jack', 1, 'Boxer', 'Spayed Female', '2021-08-27', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Zeus', 1, 'Labrador', 'Neutered Male', '2018-02-01', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Daisy', 1, 'German Shepherd', 'Unspayed Female', '2018-12-16', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Bella', 1, 'Labrador', 'Neutered Male', '2017-04-30', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Max', 1, 'Chihuahua', 'Neutered Male', '2021-03-27', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Bailey', 1, 'Golden Retriever', 'Unspayed Female', '2021-06-14', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Chloe', 1, 'Bulldog', 'Neutered Male', '2022-11-09', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Sadie', 1, 'Dachshund', 'Unspayed Female', '2021-08-19', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Daisy', 1, 'Chihuahua', 'Neutered Male', '2021-04-04', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Rocky', 1, 'German Shepherd', 'Unspayed Female', '2016-10-22', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Charlie', 1, 'Beagle', 'Unneutered Male', '2023-04-09', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Max', 1, 'Poodle', 'Neutered Male', '2022-10-11', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Buddy', 1, 'Poodle', 'Unneutered Male', '2021-05-04', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Charlie', 1, 'Shih Tzu', 'Unneutered Male', '2022-09-27', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Charlie', 1, 'Poodle', 'Unneutered Male', '2021-04-26', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Buddy', 1, 'German Shepherd', 'Spayed Female', '2023-10-06', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Luna', 1, 'Labrador', 'Unspayed Female', '2023-12-18', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Chloe', 1, 'Shih Tzu', 'Unspayed Female', '2022-01-04', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated');
`.matchAll(/\('.*', 1, '(.*?)',/g)].map(e => e[1]);
console.log(new Set(dogBreeds));

const breedToCharacteristicMap = {
  'Labrador': ['Short fur', 'Long tail', 'Floppy ears', 'Lean body'],
  'Golden Retriever': ['Medium fur', 'Plumed tail', 'Floppy ears', 'Slender body'],
  'German Shepherd': ['Medium fur', 'Long tail', 'Erect ears', 'Lean body'],
  'Chihuahua': ['Short fur', 'Curled tail', 'Bat ears', 'Compact body'],
  'Bulldog': ['Short fur', 'Straight tail', 'Bat ears', 'Heavy-boned body'],
  'Shih Tzu': ['Silky fur', 'Plumed tail', 'Floppy ears', 'Compact body'],
  'Beagle': ['Short fur', 'Straight tail', 'Floppy ears', 'Muscular body'],
  'Dachshund': ['Short fur', 'Long tail', 'Floppy ears', 'Elongated body'],
  'Boxer': ['Short fur', 'Long tail', "Floppy ears", 'Lean body'],
  'Poodle': ['Curly fur', 'Tufted tip tail', 'Floppy ears', 'Slender body']
}

const breedToAPIBreedMap = {
  'Labrador': 'labrador',
  'Golden Retriever': 'retriever/golden',
  'German Shepherd': 'germanshepherd',
  'Chihuahua': 'chihuahua',
  'Bulldog': 'bulldog',
  'Shih Tzu': 'shihtzu',
  'Beagle': 'beagle',
  'Dachshund': 'dachshund',
  'Boxer': 'boxer',
  'Poodle': 'poodle'
}


const characteristics = [...`(1, 'Short fur'),
(2, 'Medium fur'),
(3, 'Long fur'),
(4, 'Curly fur'),
(5, 'Wavy fur'),
(6, 'Straight fur'),
(7, 'Hairless fur'),
(8, 'Double coat fur'),
(9, 'Silky fur'),
(10, 'Wiry fur'),

(11, 'Long tail'),
(12, 'Short tail'),
(13, 'Docked tail'),
(14, 'Bobtail'),
(15, 'Curled tail'),
(16, 'Straight tail'),
(17, 'Plumed tail'),
(18, 'Whip-like tail'),
(19, 'Kinked tail'),
(20, 'Tufted tip tail'),

(21, 'Erect ears'),
(22, 'Droopy ears'),
(23, 'Semi-erect ears'),
(24, 'Folded ears'),
(25, 'Floppy ears'),
(26, 'Feathered ears'),
(27, 'Bat ears'),
(28, 'Cropped ears'),
(29, 'Tufted ears'),
(30, 'Button ears'),

(31, 'Lean body'),
(32, 'Muscular body'),
(33, 'Stocky body'),
(34, 'Slender body'),
(35, 'Compact body'),
(36, 'Elongated body'),
(37, 'Cobby body'),
(38, 'Athletic body'),
(39, 'Heavy-boned body');`.matchAll(/\(\d+, '(.*)'/g)].map(e => e[1]);
console.log(characteristics);

let insertStrings = 'INSERT INTO pet_pet_characteristics(pet_id, pet_characteristics_characteristic_id) VALUES'

for(let i = 0; i < dogBreeds.length; i++){
	const dogId = i+1;

	breedToCharacteristicMap[dogBreeds[i]].forEach(characteristic => {
		const characteristicId = characteristics.indexOf(characteristic)+1; // +1 bc ids start at 1
		insertStrings+=`\n(${dogId}, ${characteristicId}),`
	});
}
insertStrings = insertStrings.substring(0, insertStrings.length-1); // trim trailing comma
insertStrings+=';'
console.log(insertStrings);


let imageInsertStrings = `INSERT INTO pet_images(pet_id, image_url) VALUES`

const vals = [];
const promises = [];
for(let i = 0; i < dogBreeds.length; i++){
	const dogId = i+1;

	promises.push((async () => {
		for(let j = 0; j < 4; j++){
			const image_url = (await (await fetch(`https://dog.ceo/api/breed/${breedToAPIBreedMap[dogBreeds[i]]}/images/random`)).json()).message
			console.log(image_url);
			vals.push(`\n(${dogId}, '${image_url}'),`)
		}
	})());
}


await Promise.all(promises);
vals.sort((a, b) => {
	console.log(`a: ${a.match(/\((?<a>\d+)/).groups['a']}`)
	return Number(a.match(/\((?<a>\d+)/).groups['a']) - Number(b.match(/\((?<a>\d+)/).groups['a']);
});

imageInsertStrings += vals.join('');
imageInsertStrings = imageInsertStrings.substring(0, imageInsertStrings.length-1); // trim trailing comma
imageInsertStrings+=';'

console.log(imageInsertStrings);