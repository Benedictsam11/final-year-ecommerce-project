import React from 'react';
import Latest from '../Modules/Latest/Latest'; // Importing the Latest in Men section
import LatestWomen from '../Modules/LatestWomen/LatestWomen'; // Importing the Latest in Women section
import LatestKids from '../Modules/LatestKids/LatestKids';  // Importing the Latest in Kids section
import Brief from '../Modules/Brief/Brief';

const Shop = () => {
  return (
    <div>
      <Latest />
      <LatestWomen/>
      <LatestKids/> 
      <Brief/>
    </div>
  );
}

export default Shop;
