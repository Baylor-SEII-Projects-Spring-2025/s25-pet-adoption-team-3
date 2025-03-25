import React from "react";
import '../../styles/LearnPage.css';

const LearnPage = () => {
  return (
    <div className="learn-bg">
      <div className="learn-container">
        <h1 className="learn-heading">Why Adopt?</h1>
        
        <div className="learn-section-grid">
          <section className="learn-section">
            <img src="https://wallpaperaccess.com/full/2799120.jpg" alt="Save a life" className="learn-image" />
            <div className="learn-section-text">
              <h2>Save a life</h2>
              <p>Millions of animals enter shelters each year. By adopting, you are giving one a second chance at life and love.</p>
            </div>
          </section>

          <section className="learn-section">
            <img src="https://www.jaxhumane.org/wp-content/uploads/2019/12/Group-of-kittens-needing-foster-1024x768.jpg" alt="Reduce Pet Population" className="learn-image" />
            <div className="learn-section-text">
              <h2>Reduce Pet Overpopulation</h2>
              <p>Adopting helps fight overpopulation and decreases the number of animals euthanized every year.</p>
            </div>
          </section>

          <section className="learn-section">
            <img src="https://stevedalepetworld.com/wp-content/uploads/2021/05/hab05-11-1536x1025.jpg" alt="Perfect Match" className="learn-image" />
            <div className="learn-section-text">
              <h2>Find the Perfect Match</h2>
              <p>Shelters and adoption centers have a wide variety of breeds, personalities, and ages to match your lifestyle.</p>
            </div>
          </section>

          <section className="learn-section">
            <img src="https://th.bing.com/th/id/OIP.j3sv7fUmxnevjLjwppnqrgAAAA?rs=1&pid=ImgDetMain" alt="Ethical Pet Ownership" className="learn-image" />
            <div className="learn-section-text">
              <h2>Support Ethical Pet Ownership</h2>
              <p>By adopting, you are taking a stand against puppy mills and unethical breeding practices.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;