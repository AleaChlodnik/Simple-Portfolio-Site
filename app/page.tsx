'use client';

import { MdEdit } from "react-icons/md";
import { useState, useEffect } from 'react';

export default function Profile() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    const savedName = localStorage.getItem('profileName');
    
    if (savedImage) {
      setImage(savedImage);
    }

    if (savedName) {
      setName(savedName);
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImage(objectUrl);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    localStorage.setItem('profileName', newName);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/portfolio_profile_bg.gif)' }}> 
      <div className="relative w-72 h-72">
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img src={image ?? '/default-profile.png'} alt="Profile Picture" className="w-full h-full object-cover" />
        </div>
        <label className="absolute bottom-2 right-2 border-2 border-white bg-[#bdada5] p-2 rounded-full shadow cursor-pointer">
        <MdEdit className="text-white w-8 h-8" />
          <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageChange} />
        </label>
      </div>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Your Name"
        className="mt-6 text-4xl p-1 font-semibold border-4 border-white bg-[#bdada5] rounded-full w-[16%] text-white text-center"
      />
    </div>
  );
}
