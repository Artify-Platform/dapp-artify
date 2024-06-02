# ARTIFY

    Artify is a platform that allow creating digital NFTs using voice commands by connecting digital wallets. It offers features designed to streamline the creative process and enhance digital art through AI technology.

# Table of Contents

- [ARTIFY](#artify)
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Installation](#installation)
  - [System Requirements:](#system-requirements)
- [Installation Guide](#installation-guide)
  - [Project Structure](#project-structure)
- [Usage:](#usage)
- [Contribution](#contribution)
- [License](#license)
- [Contact](#contact)

# <div id='features'>Features</div>

    - Image Generation: Use voice commands to create images based on the desired theme.
    - Mint NFTs: Create a new digital asset on a blockchain through connecting digital wallets.

# <div id='installation'>Installation</div>

### System Requirements:

    - Next v14 or higher
    - Node.js v20 or higher
    - Yarn v1.22.18 or higher

# <div id='installation-guide'>Installation Guide</div>

    1. Clone the repository:
        - git clone https://gitlab.rinznetwork.com/frontend/artify.git
        - cd artify
    2. Install dependencies:
        - yarn
    3. Start the application:
        - yarn start:dev
    4. Access the application at http://localhost:3000

## Project Structure

    ARTIFY/
        |-- .env
        │     ├── .evn.development    # Environment variables
        │     ├── .evn.production
        │     ├── .evn.staging
        ├── public/                   # Public folder
        │    ├── fonts/               # Fonts folder
        │    ├── images/              # Static images
        │    └── pwa/                 # PWA configuration folder
        ├── src/
        │    ├── app/                 # App Router
        │    ├── components/          # React components
        │    ├── constants/           # Constant files
        │    ├── hooks/               # Custom hook files
        │    ├── provider/            # Custom provider files
        │    ├── services/            # External services files
        │    ├── types/               # Type files
        │    └── utils/               # Utility functions
        ├── .gitignore                # Git ignore file
        ├── config.json               # ZKLogin configuration file
        ├── package.json              # npm configuration file
        ├── tailwind.config.ts        # Tailwind configuration file
        └── next.config.mjs           # Next.js configuration file

# <div id='usage'>Usage:</div>

    API Endpoints:
        - API Chat: https://artify.vertiree.com/api/api-docs#/


# <div id='contribution'>Contribution</div>

    1. Fork the project
    2. Create a new branch (git checkout -b feature/your-feature-name)
    3. Commit your changes (git commit -m 'Add new feature')
    4. Push to the branch (git push origin feature/your-feature-name)
    5. Open a Pull Request

# <div id='license'>License</div>

     This project is licensed under the MIT License.

# <div id='contact'>Contact</div>

     if you have any questions or feedback, please contact us via email: hello@esollabs.com
