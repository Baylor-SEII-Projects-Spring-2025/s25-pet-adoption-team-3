# Pet Adoption Spring 2025

This is the template project for the Baylor Software Engineering II class project for Spring 2025. There are several parts to this template project:
 - `/pet-adoption-api` - API/Backend - The server component of the project, using Java Spring as a framework.
 - `/pet-adoption-frontend` - Web/Frontend - The web component of the project, using React and Material UI as a framework.
 - `/cicd` and `/docker` - Sample resources to aid you in getting your GCP deployment working.

This `README.md` file will serve as a general setup guide for the project. In addition, some folders also have `README.md` files to further go into detail about their contents and provide some project guidance.

## Table of Contents

- [Pet Adoption Spring 2025](#pet-adoption-spring-2025)
  - [Table of Contents](#table-of-contents)
  - [Note about IDEs](#note-about-ides)
  - [MySQL Database Setup Instructions](#mysql-database-setup-instructions)
  - [Backend (`/pet-adoption-api`) Setup Instructions](#backend-pet-adoption-api-setup-instructions)
  - [Frontend (`/pet-adoption-frontend`) Setup Instructions](#frontend-pet-adoption-frontend-setup-instructions)
  - [CI/CD (GitHub \& GCP) Setup Instructions](#cicd-github--gcp-setup-instructions)

## Note about IDEs
We **highly** recommend opening the frontend/ui and backend/api projects in separate IDE instances **AND** opening the project folders themselves instead of the root folder. The dev tools that come pre-configured with this template project work much better out of the box if your IDE has the individual project open instead of the root repository folder.

In other words:
- Open the `pet-adoption-api` folder in whatever Java IDE you want to use (the instructions below use IntelliJ).
- Open the `pet-adoption-frontend` folder in whatever JavaScript IDE you want to use (the instructions below use VS Code or WebStorm).

## MySQL Database Setup Instructions

[(back to top)](#table-of-contents)

1. Install **Docker**, following the instructions in the provided link for your operating system:
   - **Windows**: https://docs.docker.com/desktop/windows/install/
     - You may need to enable WSL on your computer: https://learn.microsoft.com/en-us/windows/wsl/install
   - **macOS**: https://docs.docker.com/desktop/install/mac-install/
     - Make sure to choose **Mac with Intel chip** or **Mac with Apple chip** depending on your specific machine
2. Start the database using Docker Compose in the command-line: `docker compose -f docker/local.docker-compose.yml up -d`
   - To stop the database, use: `docker compose -f docker/local.docker-compose.yml down`
   - To clear the data from the database, use: `docker compose -f docker/local.docker-compose.yml down -v`

## Backend (`/pet-adoption-api`) Setup Instructions

[(back to top)](#table-of-contents)

1. Install **Intellij IDEA Ultimate Edition**: https://www.jetbrains.com/idea/download
   -  You will need to create a JetBrains account using your student/Baylor email address to get a free license for the Ultimate edition. We **will** be using features of the Ultimate edition during this project, so make sure to get it even if you already have the community edition installed.
2. Install **Java 23** (OpenJDK):
   - Windows: https://www.oracle.com/java/technologies/downloads/#jdk23-windows
   - MacOS: https://www.oracle.com/java/technologies/downloads/#jdk23-mac
   - Feel free to install Java 23 in any other way that makes sense for your local environment (such as if you are running Linux or using a package manager like Homebrew or Chocolatey).
3. Setup the project in IntelliJ IDEA:
   1. Open the project at the `/pet-adoption-api` directory in IntelliJ. In older versions of IntelliJ, you may need to click "Import from existing sources" instead and choose the `/pet-adoption-api` directory.
   2. IntelliJ should autodetect the Gradle project and start downloading dependencies. Confirm that this is happenening by looking for a progress bar in the bottom right of the window.
   3. Configure Lombok:
      1. Intall the Lombok plugin for IntelliJ (Intellij IDEA > Settings > Plugins ... Search for "Lombok" by JetBrains)
      2. Enable Annotation Processing in the compiler settings (Intellij IDEA > Settings > Build, Execution, Deployment > Compiler > Annotation Processors ... Check "enable annotation processing")
4. Connect to your local database in IntellIJ:
   1. Open the "Database" tab (if you don't see it, go to View > Tool Windows > Database)
   2. Click the "+" button and add a Data Source > MySQL
   3. Enter "root" for the username
   4. Enter "password" for the password
   5. If there is a warning at the bottom of the dialog to "Download missing driver files", click the "Download" button to do so.
   6. Click "Test Connection" to verify the connection succeeded. If it did, click "OK" to close the dialog.
5. Start the backend. The easiest way to do this is to open `PetAdoptionApplication.java` and click the "play" button on the left.
6. Verify the backend is running by navigating to `http://localhost:8080/ping` in your web browser. If you see `pong!`, then everything is working!

## Frontend (`/pet-adoption-frontend`) Setup Instructions

[(back to top)](#table-of-contents)

1. Install **Visual Studio Code**: https://code.visualstudio.com/download
2. Install **Node.js** version **22**:
   - Just like the backend, installing a version higher than 22 (like 23 or 24) will likely still work, but since the template project is configured using Node 22, it is recommeneded sticking with that
   - If you anticipate yourself needing to swap between different Node version often or wanting an easy way to update Node versions, we recommend using [`nvm`](https://github.com/nvm-sh/nvm) or [`nvm-windows`](https://github.com/coreybutler/nvm-windows) to install Node
   - Otherwise, you can download Node 22 directly from the Node.js website: https://nodejs.org/en/download/
3. Install **Yarn**: run `corepack enable`
   - If this command doesn't work, you could try `npm install -g yarn` instead
   - Verify Yarn is installed with `yarn -v`
4. Install project dependencies: `yarn install`
5. Start the frontend: `yarn dev`
   - `yarn dev` starts the project in development mode
   - `yarn build` builds a production version of the project that can be run with `yarn start`
6. Verify the frontend is running by navigating to `http://localhost:3000` in your web browser. If you see the home page, then everything is working!
7. (Optional, but highly recommended) Configure ESLint and Prettier in your IDE. The template project comes pre-configured with ESLint and Prettier; see the [frontend's README](./pet-adoption-frontend/README.md) for more information about these tools.
   1. **VS Code**
      1. Install the **ESLint** extension: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
      2. Install the **Prettier** extension: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
   2. **WebStorm (or other IntelliJ-based IDEs)**
      1. **ESLint** should work out of the box, but if not: https://www.jetbrains.com/help/webstorm/eslint.html
      2. Install the **Prettier** plugin:
         1. Settings > Plugins > (search for prettier) - install if not already
         2. Settings > Languages & Frameworks > JavaScript > Prettier
            1. Enable "Automatic Prettier Configuration"
            2. Enable "Run on save"
         3. More instructions if it doesn't work out of the box: https://www.jetbrains.com/help/webstorm/prettier.html

## CI/CD (GitHub & GCP) Setup Instructions

[(back to top)](#table-of-contents)

Only one deployed instance of your project is required. However, we require that all team members are familiar with the process of how to deploy the project to GCP, so please work together in your groups so that everyone is familiar with this workflow.

GCP offers a free trial that will work for our purposes in this project. Keep in mind, however, that the free trial is not unlimited—it is up to your team to ensure that you are staying within the free trial budget. However, the budget should be more than sufficient for the purposes of this project.

1. Open the Google Cloud Console: https://console.cloud.google.com/ and create a Google account if you don't already have one
2. Enable the GCP free trial by hitting the "try for free" button on the home page and following the instructions.
   1. Choose "individual" as the account type.
   2. Enter a credit card or debit card. As the page says, "We ask you for your credit card to make sure you are not a robot. If you use a credit or debit card, you won't be charged unless you manually activate your full account."
3. Activating the free trial should have created a project called "My First Project". Projects are simply a way to organize cloud resources in GCP. If you want to use a different project or create a new one, click the dropdown at the top of the screen
4. In the search bar, search for "Compute Engine". This should take you to a page called "Compute Engine API". Click the **enable** button
5. Create a Linux VM in GCP. This will be your production server
   1. Search for "Add VM Instance". This should open the instance creation page
   2. You can leave everything as default except for (click the tabs on the left):
      1. **Networking > Firewall**: Check the options for allowing both HTTP and HTTPS traffic to the VM. This will give your VM an external IP address once it is created
      2. **OS and Storage > Operating system and storage**: click "Change" set "Size" to 100 GB
   3. Click the "Create" button
6. Navigate to the "VM instances" tab and click the "Set up firewall rules" option
   1. Select the `default-allow-http` rule, and select "Edit" at the top of the page
   2. In the "TCP Ports" section, add 8080 and 3000. This will allow you to access those ports from your local machine. In the future, if you need to add additional or different HTTP ports, you would do so in the same way. Also, if you want to add HTTPS ports, do so in the same way under the `default-allow-https` rule
7. Setup a GitHub runner. The GitHub runner waits for certain actions to happen in your repository and runs a user-defined set of commands when one occurs. We will be using this runner to rebuild and redeploy our project whenever a commit on the `main` branch occurs. First, we need to link the runner to your repository:
   1. Open an SSH terminal to your VM in GCP
   2. Determine which CPU architecture your VM is by running the `lscpu` command. The `Architecture` field will tell you if it is `x86_64` (x86) or `aarch64` (ARM64) for the next step.
   3. Install a GitHub self-hosted runner on the VM using the instructions found in your GitHub Repository at Settings > Actions > Runners > New self-hosted runner. Follow the "Download" and "Configure" instructions for Linux on your VM's architecture (likely x86) **EXCEPT FOR THE `./run.sh` COMMAND.** You can leave any settings as their default values when prompted.
   4. Install Docker on your VM, using the following instructions (under "Install using the apt repository"): https://docs.docker.com/engine/install/debian/#install-using-the-repository
   5. Run the following command, giving your GitHub runner permission to use Docker commands: `sudo usermod -aG docker <my-username>` (`<my-username>` is the username that you used to log in via SSH to the VM - if you don't know, look at the command-line prompt, it should say your username to the left of the `@` symbol).
   6. To check if `<my-username>` now has access to Docker run: `sudo -u <my-username> -H docker info`. This command will fail if that user does not have permission.
   7. Finally, configure your GitHub runner to run as a service in the background and automatically restart if it crashes. Run `sudo ./svc.sh install` and `sudo ./svc.sh start`. After you deploy your project, you can check the status by running: `sudo ./svc.sh status`. More Info: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service
8. Write a GitHub Actions workflow (CI pipeline) file.
   - This file will tell the GitHub runner what to do whenever a commit is made to the branch the file is in; you can learn more here: https://docs.github.com/en/actions/quickstart
   - We want our runner to build a Docker image for both our frontend and backend on a commit and then deploy those images as containers, along with our database image, to our production server. The way this is done is largely up to you; we have provided sample Dockerfiles (`/docker`) and a sample GitHub actions workflow file (`/cicd/sample-github-actions-ci.yml`) to give an example of how it could be achieved. You will need to make minor modifications to the sample workflow file for it to work (see more in the `sample-github-actions-ci.yml` file)
   - Whenever a commit is made, a workflow should be created for your GitHub project. You can view this workflow to see its status while it is executing in the "Actions" tab on GitHub. Create a commit to test this.
   - To learn more about how to create and run a Docker image from a GitHub Actions workflow, see: https://linuxhit.com/how-to-create-docker-images-with-github-actions/ or https://docs.github.com/en/actions/creating-actions/creating-a-docker-container-action

This will get basic CI/CD functionality setup for your project. Feel free to customize this process to fit your needs as the project progresses. Note that one of your project deliverables will be extending the CI/CD to also support running automated tests.