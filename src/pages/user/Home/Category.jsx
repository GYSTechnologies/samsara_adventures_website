import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';

function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await axiosInstance.get('api/category/getAllCategories?page=1&limit=10');
      setCategories(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='flex bg-[#eff5d2] justify-center items-center flex-col'>
      <div className="grid grid-cols-5 max-w-5xl gap-1 sm:gap-2 md:gap-4">
        {categories.map((category) => (
          <a 
            href={`/destination?category${category.category}`} 
            key={category.id} 
            className="p-4 rounded-full flex flex-col items-center group"
          >
            <div className="relative">
              {/* Glowing border wrapper */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-lime-400 via-lime-500 to-lime-500 rounded-full opacity-25 blur-sm group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              
              {/* Image */}
              <img
                src={category.image}
                alt={category.category}
                width={100}
                height={100}
                className="relative w-10 h-10 sm:h-12 sm:w-12 md:h-16 md:w-16 mb-2 rounded-full object-cover border-2 border-white"
              />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-lime-800 group-hover:text-lime-900 transition-colors">
              {category.category}
            </h3>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Category;
