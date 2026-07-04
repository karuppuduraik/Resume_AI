import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-extrabold text-primary font-poppins">404</h1>
        <h2 className="text-2xl font-bold font-poppins text-brandText-light dark:text-brandText-dark mt-4">Page Not Found</h2>
        <p className="text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-2 max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved to a different URL.
        </p>
        <Link 
          to="/"
          className="premium-btn text-white bg-primary hover:bg-primary-dark shadow-glass mt-8 inline-block"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
