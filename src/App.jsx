import React, { useState } from 'react';
import { Chat } from "./components/index";
import { FaTooth } from "react-icons/fa";

const App = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className='z-20 overflow-hidden'>

      {!isOpen && <button onClick={() => setIsOpen(!isOpen)}
        className='z-20 group bg-blue-900 p-5 rounded-full fixed bottom-9 right-2'>
          <span className='text-black bg-white flex flex-col absolute -top-12 w-96 opacity-0 group-hover:opacity-100 px-6 -right-96 py-4 group-hover:-right-2 duration-300 transition-all h-fit rounded-bl-3xl'>
            <p className='capitalize font-bold text-xl'>what bring you here today?</p>
            <button className='capitalize w-full rounded-full text-2xl py-2 mt-8 text-center bg-blue-900 font-bold text-white'>chat live now</button>
          </span>
        <FaTooth color='white' className='z-20' size={30} />
        <i className='absolute bg-blue-900 h-full w-[200%] rounded-t-3xl rounded-b-3xl top-0 left-0 -z-10'></i>
      </button>}

      <div className={`h-fit overflow-hidden ms-auto duration-300 transition-all glass border-2 ${isOpen ? "w-96 opacity-100" : "w-0 opacity-0"}`}>
        <Chat isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <i className="main glass -z-10"></i>
    </main>
  );
}

export default App;
