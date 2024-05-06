import React from 'react';

const Board = () => {
  const handleAreaClick = (areaName) => {
    alert(`Clicked on: ${areaName}`);
  };

  return (
    // Using Tailwind classes to control maximum size and responsiveness
    <div className="w-full h-full max-w-4xl max-h-3xl mx-auto">
      <svg className="w-full h-full" viewBox="0 0 800 600">
      {/* blue section */ }
        <image href={('../public/0.png')} width="800" height="600" />
          <rect x="215" y="155" width="15" height="23" fill="transparent" stroke="blue" strokeWidth="2" 
          onClick={() => handleAreaClick('Carnegie')} /> 
          <rect x="250" y="155" width="15" height="23" fill="transparent" stroke="blue" strokeWidth="2" 
          onClick={() => handleAreaClick('Gateway')} /> 
          <rect x="265" y="183" width="15" height="23" fill="transparent" stroke="blue" strokeWidth="2" 
          onClick={() => handleAreaClick('River Terrace')} /> 
          <rect x="315" y="155" width="15" height="23" fill="transparent" stroke="blue" strokeWidth="2" 
          onClick={() => handleAreaClick('ABS')} /> 
          <rect x="210" y="183" width="15" height="23" fill="transparent" stroke="blue" strokeWidth="2" 
          onClick={() => handleAreaClick('Burchard')} /> 
          <rect x="200" y="110" width="15" height="23" fill="transparent" stroke="blue" strokeWidth="2" 
          onClick={() => handleAreaClick('Sig Ep')} /> 
        <rect x="130" y="160" width="15" height="23" fill="transparent" stroke="blue" strokeWidth="2" 
          onClick={() => handleAreaClick('EAS Lawn')} /> 
        <rect x="165" y="160" width="15" height="23" fill="transparent" stroke="blue" strokeWidth="2" 
          onClick={() => handleAreaClick('EAS')} /> 
        <rect x="140" y="220" width="15" height="23" fill="transparent" stroke="blue" strokeWidth="2" 
          onClick={() => handleAreaClick('McLean Labs')} /> 
        <rect x="165" y="220" width="15" height="23" fill="transparent" stroke="blue" strokeWidth="2" 
          onClick={() => handleAreaClick('McLean')} /> 
        <rect x="210" y="225" width="15" height="23" fill="transparent" stroke="blue" strokeWidth="2" 
          onClick={() => handleAreaClick('Babbio Steps')} /> 
        <rect x="100" y="180" width="15" height="23" fill="transparent" stroke="blue" strokeWidth="2" 
          onClick={() => handleAreaClick('Stevens Park')} /> 

        {/* green section */ }
        <rect x="140" y="260" width="15" height="23" fill="transparent" stroke="green" strokeWidth="2" 
          onClick={() => handleAreaClick('McLean Lot')} /> 
        <rect x="180" y="260" width="15" height="23" fill="transparent" stroke="green" strokeWidth="2" 
          onClick={() => handleAreaClick('Babbio Garage')} /> 
        <rect x="210" y="260" width="15" height="23" fill="transparent" stroke="green" strokeWidth="2" 
          onClick={() => handleAreaClick('Babbio')} /> 
        <rect x="185" y="310" width="15" height="23" fill="transparent" stroke="green" strokeWidth="2" 
          onClick={() => handleAreaClick('Pier Soccer Field')} /> 
        <rect x="130" y="310" width="15" height="23" fill="transparent" stroke="green" strokeWidth="2" 
          onClick={() => handleAreaClick('Pier')} /> 
         <rect x="250" y="225" width="15" height="23" fill="transparent" stroke="green" strokeWidth="2" 
          onClick={() => handleAreaClick('Morton')} /> 
        <rect x="275" y="225" width="15" height="23" fill="transparent" stroke="green" strokeWidth="2" 
          onClick={() => handleAreaClick('Pierce')} /> 
        <rect x="300" y="225" width="15" height="23" fill="transparent" stroke="green" strokeWidth="2" 
          onClick={() => handleAreaClick('Kidde')} /> 
         <rect x="285" y="290" width="15" height="23" fill="transparent" stroke="green" strokeWidth="2" 
          onClick={() => handleAreaClick('Davis')} /> 
        <rect x="310" y="270" width="15" height="23" fill="transparent" stroke="green" strokeWidth="2" 
          onClick={() => handleAreaClick('Walker Gym')} /> 
        <rect x="350" y="200" width="15" height="23" fill="transparent" stroke="green" strokeWidth="2" 
          onClick={() => handleAreaClick('Debaun Athletic Complex')} /> 
        <rect x="220" y="340" width="15" height="23" fill="transparent" stroke="green" strokeWidth="2" 
          onClick={() => handleAreaClick('Griffith')} /> 

       {/* purple section */ }
       <rect x="370" y="260" width="15" height="23" fill="transparent" stroke="purple" strokeWidth="2" 
          onClick={() => handleAreaClick('Schaefer')} /> 
        <rect x="410" y="220" width="15" height="23" fill="transparent" stroke="purple" strokeWidth="2" 
          onClick={() => handleAreaClick('Baseball Field')} /> 
        <rect x="420" y="280" width="15" height="23" fill="transparent" stroke="purple" strokeWidth="2" 
          onClick={() => handleAreaClick('Library')} /> 
        <rect x="380" y="300" width="15" height="23" fill="transparent" stroke="purple" strokeWidth="2" 
          onClick={() => handleAreaClick('Schaefer Lawn')} /> 
        <rect x="345" y="330" width="15" height="23" fill="transparent" stroke="purple" strokeWidth="2" 
          onClick={() => handleAreaClick('UCC South Tower')} /> 
        <rect x="380" y="350" width="15" height="23" fill="transparent" stroke="purple" strokeWidth="2" 
          onClick={() => handleAreaClick('UCC North Tower')} />
        <rect x="450" y="200" width="15" height="23" fill="transparent" stroke="purple" strokeWidth="2" 
          onClick={() => handleAreaClick('8th Street Lot')} />  
        <rect x="430" y="385" width="15" height="23" fill="transparent" stroke="purple" strokeWidth="2" 
          onClick={() => handleAreaClick('Howe')} /> 
        <rect x="460" y="360" width="15" height="23" fill="transparent" stroke="purple" strokeWidth="2" 
          onClick={() => handleAreaClick('Howe Circle')} />
        <rect x="420" y="330" width="15" height="23" fill="transparent" stroke="purple" strokeWidth="2" 
          onClick={() => handleAreaClick('Statue')} />     
        <rect x="470" y="295" width="15" height="23" fill="transparent" stroke="purple" strokeWidth="2" 
          onClick={() => handleAreaClick('Palmer')} />
        <rect x="505" y="380" width="15" height="23" fill="transparent" stroke="purple" strokeWidth="2" 
          onClick={() => handleAreaClick('Howe Lot')} /> 

        {/* red section */}
        <rect x="500" y="150" width="15" height="23" fill="transparent" stroke="red" strokeWidth="2" 
          onClick={() => handleAreaClick('Chi Phi')} />
        <rect x="600" y="150" width="15" height="23" fill="transparent" stroke="red" strokeWidth="2" 
          onClick={() => handleAreaClick('Piskies')} />
        <rect x="500" y="230" width="15" height="23" fill="transparent" stroke="red" strokeWidth="2" 
          onClick={() => handleAreaClick('Jonas')} />
        <rect x="530" y="290" width="15" height="23" fill="transparent" stroke="red" strokeWidth="2" 
          onClick={() => handleAreaClick('Humphreys')} />    
        <rect x="505" y="330" width="15" height="23" fill="transparent" stroke="red" strokeWidth="2" 
          onClick={() => handleAreaClick('Volleyball Courts')} />
        <rect x="560" y="315" width="15" height="23" fill="transparent" stroke="red" strokeWidth="2" 
          onClick={() => handleAreaClick('Martha')} />   
        <rect x="620" y="315" width="15" height="23" fill="transparent" stroke="red" strokeWidth="2" 
          onClick={() => handleAreaClick('Castle Point')} />
        <rect x="570" y="250" width="15" height="23" fill="transparent" stroke="red" strokeWidth="2" 
          onClick={() => handleAreaClick('Student Wellness Center')} />
        <rect x="540" y="180" width="15" height="23" fill="transparent" stroke="red" strokeWidth="2" 
          onClick={() => handleAreaClick('Lodge')} />
        <rect x="630" y="280" width="15" height="23" fill="transparent" stroke="red" strokeWidth="2" 
          onClick={() => handleAreaClick('Tennis Courts')} />
        <rect x="650" y="380" width="15" height="23" fill="transparent" stroke="red" strokeWidth="2" 
          onClick={() => handleAreaClick('Skate Park')} />
        <rect x="670" y="260" width="15" height="23" fill="transparent" stroke="red" strokeWidth="2" 
          onClick={() => handleAreaClick('Castle Point Lot')} />

      </svg>
    </div>
  );
};

export default Board;
