import React from 'react';

const pets = [
  {
    id: 1,
    name: 'Luna',
    breed: 'Golden Retriever',
    aboutMe: 'I love long walks, belly rubs, and treats!',
    image: ['https://thehappypuppysite.com/wp-content/uploads/2017/12/puppy8.jpg']
  },
  {
    id: 2,
    name: 'Milo',
    breed: 'Tabby Cat',
    aboutMe: 'Expert napper and laser dot chaser.',
    image: ['https://catinaflat.blog/wp-content/uploads/2022/05/famous-tabby-cats-1024x1024.jpg']
  },
  {
    id: 3,
    name: 'Daisy',
    breed: 'Beagle',
    aboutMe: 'Sweet and curious, always sniffing around!',
    image: ['https://th.bing.com/th/id/OIP.5lqRdDCzHc73uM7nl2LkbAHaE7?rs=1&pid=ImgDetMain']
  },
  {
    id: 4,
    name: 'Shadow',
    breed: 'Black Cat',
    aboutMe: 'I may be mysterious, but I love cuddles.',
    image: ['https://www.rover.com/blog/wp-content/uploads/black-cat-min-e1680636929915.jpg']
  },
  {
    id: 5,
    name: 'Charlie',
    breed: 'Labrador',
    aboutMe: 'Loyal, energetic, and always ready to play fetch!',
    image: ['https://th.bing.com/th/id/OIP.byyw3RUlS341tFQO9TePZwHaGX?rs=1&pid=ImgDetMain']
  },
  {
    id: 6,
    name: 'Cleo',
    breed: 'Siamese Cat',
    aboutMe: 'Elegant, talkative, and totally charming.',
    image: ['https://images.saymedia-content.com/.image/t_share/MTc0MjkzNzMyNTYzMTAxNTY0/siamese-cat-names.jpg']
  },
  {
    id: 7,
    name: 'Rocky',
    breed: 'Bulldog',
    aboutMe: 'Chill, loyal, and loves a good nap on the couch.',
    image: ['https://th.bing.com/th/id/OIP.ncltT8qUghqFu7Xixax4bQAAAA?rs=1&pid=ImgDetMain']
  },
  {
    id: 8,
    name: 'Whiskers',
    breed: 'Calico Cat',
    aboutMe: 'Playful and sweet, and a total attention seeker.',
    image: ['https://catinaflat.blog/wp-content/uploads/2022/08/calico-cat-personality.jpg']
  }
];

const GalleryPage = () => {
  return (
    <div className="gallery-bg">
      <div className="gallery-container">
        <h1 className="gallery-heading">Meet Your New BFF</h1>
        <div className="gallery-grid">
          {pets.map((pet) => (
            <div key={pet.id} className="gallery-card">
              <img src={pet.image[0]} alt={pet.name} className="gallery-image" />
              <div className="gallery-card-body">
                <h2 className="pet-name">{pet.name}</h2>
                <p className="pet-breed">{pet.breed}</p>
                <p className="pet-about">{pet.aboutMe}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
