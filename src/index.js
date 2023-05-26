import * as React from 'react';

import {StrictMode} from 'react';

import {createRoot} from 'react-dom/client';

import {BrowserRouter} from 'react-router-dom';

import 'react-tooltip/dist/react-tooltip.css'


import Mid from './Mid';


import './index.css'

const rootElement = document.getElementById('root');

const root = createRoot(rootElement);

root.render(
    <StrictMode>

        <BrowserRouter>
            <Mid/>
        </BrowserRouter>

    </StrictMode>
);