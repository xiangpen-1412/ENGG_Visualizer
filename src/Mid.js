import * as React from 'react';

import { Routes, Route } from 'react-router-dom';

 

import Home from './Home';

import App from './App';

 

export default function Mid() {

  return (

    <div className="Mid">

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/App" element={<App />} />

      </Routes>

    </div>

  );

}