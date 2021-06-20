# Hours-Take-Home-Project

<!-- ABOUT THE PROJECT -->
## About The Project
This is my demo for Hours take home project. It is built with React, Material-UI, Express, and Socket.IO. Since I chose to use a UI library, and Material-UI does not generally work well with Sass, I styled the project with Material-UI's built-in hooks. 

The app is deployed at https://hours-take-home-project.vercel.app/. The backend is deployed at https://ancient-caverns-23167.herokuapp.com/.

<!-- GETTING STARTED -->
## Getting Started
Create a ```.env``` file in ```backend``` folder and a ```.env.local``` file in ```frontend``` folder.

Example ```.env``` content:
```sh
PORT_API=5000
URL_APP=http://localhost:3000
```

Example ```.env.local``` content:
```sh
NEXT_PUBLIC_URL_API=http://localhost:5000
```

Then make two terminals. In the first,
```sh
cd backend
npm run dev
```

In the second,
```sh
cd frontend
npm run dev
```

