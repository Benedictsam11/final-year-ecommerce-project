import React from 'react';
import './VideoComponent.css'; // Import the CSS file for styling

const VideoComponent = () => {
  return (
    <div>
      <div className="video-container">
        <h1>new here? Get 10% off selected styles when you subscribe to our regular updates*. Usecode:SPRING20</h1>
        <video width="100%" height="auto" controls autoPlay muted loop>
          <source src="/videos/sample-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="video-container second-video">
        <video width="100%" height="auto" controls autoPlay muted loop>
          <source src="/videos/sample-video2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoComponent;
