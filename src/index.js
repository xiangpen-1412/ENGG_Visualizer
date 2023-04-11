import * as React from 'react';

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

// import ReactDOM from "react-dom/client";

import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

 

import Mid from './Mid';

 

import './index.css'

const rootElement = document.getElementById('root');

const root = createRoot(rootElement);

 

root.render(

  <StrictMode>

    <BrowserRouter>

      <Mid />
      <ReactTooltip id="toolTip1" render={({content, activeAnchor})=>(
        <div className='TOOLTIPPPP'>
          <b>{activeAnchor?.getAttribute('extendedName')}</b>
          <br/>
          <b>________________________________________</b>
          <div>
            {content}
            <br/>
            <b>Accredation Unit:</b>
            <br/>
            {activeAnchor?.getAttribute('accreditionUnits')}
            
          </div>
        </div>
      )}
      />

    </BrowserRouter>

  </StrictMode>

);