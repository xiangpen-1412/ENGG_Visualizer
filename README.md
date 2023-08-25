# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## GitHub Repo

All of the contained files are also available at [Project Repo](https://github.com/xiangpen-1412/ENGG_Visualizer).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)




# Future Development

Effective August 25, 2023, Version 2 of the Visualizer is complete. It is hosted and can be accessed at: 

http://129.128.215.39/


There are a number of outstanding features that could be implemented as an effort of future advancement, as follows:

- Connecting the data directly to beartracks
- Connecting the Scheduler to students' schedules
- Improving styling of the "Export Results to PDF" feature so that page breaks do not divide elements
- Some lectures are tied to specific lab sections, these should be connected on the website somehow
- If the tab is switched to 'Scheduler' from 'Visualizer' too quickly on load, an error is thrown
- Tutorials should be added to the 'About' tab to show how the website works


### Code Structure

Below is an ascii diagram of the project code. To make changes to any part, find the related component and start there.
App.js is the hub, with other components either located inside, or in seperate files. Home.js defines the items for the
home screen, App.js for everything afterwards. Most js files have a corresponding .css file defining their styling. 

Visualizer, Scheduler, Results, and About are each a tab in the /App page, and are hidden or shown one at a time. 



Structure.js   App.js                      Scheduler.js
┌────────────┐ ┌─────────────────────────┐ ┌────────────────┐
│            │ │                         │ │                │
│            │ │ Visualizer              │ │           ◄────┼────── Searchbar.js
│            │ │ ┌─────────────────────┐ │ │                │   
│            │ │ │                     │ │ │           ◄────┼────── ImportCSV.js
└──────┬─────┘ │ │                     │ │ │                │       ExportCSV.js
       └───────┼─┼─────►               │ │ └────────┬───────┘       ExportPDF.js
Dropdown.js ───┼─┼─────►               │ │          │
               │ └─────────────────────┘ │          │
               │                         │          │
               │            ◄────────────┼──────────┘
               │                         │ Results.js
               │                         │ ┌────────────────┐
               │                         │ │                │
               │                         │ │           ◄────┼────── VisualizerResults.js
               │                         │ │                │
               │                         │ └────────┬───────┘
               │                         │          │
               │            ◄────────────┼──────────┘
               │                         │
               │ About                   │
               │ ┌─────────────────────┐ │
               │ │                     │ │
               │ │                     │ │
               │ └─────────────────────┘ │
               └─────────────────────────┘


