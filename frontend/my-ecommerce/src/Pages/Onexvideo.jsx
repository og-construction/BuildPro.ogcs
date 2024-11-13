import React from 'react';
import './Onexvideo.css';
import MoscoImage from '../Components/Assets/mascot5.png';
import OgcsVideo from '../Components/Assets/all_product';

const Onexvideo = () => {
  return (
    <div className='building-materials'>
      <h1 className='section-title'>We Provide You the Best Services</h1>
      <div className='content-container'>
        <div className='video-box'>
          <video controls>
            <source src={OgcsVideo} type="moscot5" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className='mascot-box'>
          <a href="https://www.bing.com/search?pglt=41&q=google">
            <img src={MoscoImage} alt="mascot" className='mascot-image' />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Onexvideo;
