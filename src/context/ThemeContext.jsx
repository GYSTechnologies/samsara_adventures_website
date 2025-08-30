// // src/contexts/ThemeContext.jsx
// import React, { createContext, useContext, useEffect, useState } from 'react';

// const ThemeContext = createContext();

// export const useTheme = () => {
//   return useContext(ThemeContext);
// };

// export const ThemeProvider = ({ children }) => {
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme) {
//       setIsDark(savedTheme === 'dark');
//     } else {
//       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//       setIsDark(prefersDark);
//     }
//   }, []);

//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//     localStorage.setItem('theme', isDark ? 'dark' : 'light');
//   }, [isDark]);

//   const toggleTheme = () => {
//     setIsDark(!isDark);
//   };

//   const value = {
//     isDark,
//     toggleTheme,
//   };

//   return (
//     <ThemeContext.Provider value={value}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// // src/contexts/ThemeContext.js
// import React, { createContext, useContext, useEffect, useState } from 'react';

// const ThemeContext = createContext();

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };

// export const ThemeProvider = ({ children }) => {
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     // Check if user has a theme preference saved
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme) {
//       setIsDark(savedTheme === 'dark');
//     } else {
//       // If no saved preference, check system preference
//       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//       setIsDark(prefersDark);
//     }
//   }, []);

//   useEffect(() => {
//     // Apply theme class to document
//     if (isDark) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//     // Save preference
//     localStorage.setItem('theme', isDark ? 'dark' : 'light');
//   }, [isDark]);

//   const toggleTheme = () => {
//     setIsDark(!isDark);
//   };

//   const value = {
//     isDark,
//     toggleTheme,
//   };

//   return (
//     <ThemeContext.Provider value={value}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };


// src/contexts/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // ✅ Loading state add karo

  useEffect(() => {
    // Check if user has a theme preference saved
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // If no saved preference, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
    setIsLoaded(true); // ✅ Mark as loaded
  }, []);

  useEffect(() => {
    if (!isLoaded) return; // ✅ Don't apply until loaded
    
    // Apply theme class to document
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark'; // ✅ Better browser support
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light'; // ✅ Better browser support
    }
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark, isLoaded]); // ✅ Add isLoaded to dependencies

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const value = {
    isDark,
    toggleTheme,
    isLoaded // ✅ Expose loading state if needed
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};