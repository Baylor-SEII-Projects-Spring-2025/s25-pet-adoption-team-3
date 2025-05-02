# 🐾 Adopt Don't Shop - Pet Adoption Platform

\
A full-stack pet adoption platform that connects users with pets in need of a home. The platform supports user authentication, pet listings, and adoption requests, using **Spring Boot, Next.js, and Google OAuth 2.0**.

---

## 🚀 Features

- 🔒 **Authentication & Authorization**
  - Email/password login
  - Google OAuth 2.0 authentication
  - Secure user sessions with **Spring Security**
- 🐶 **Pet Listings**
  - View adoptable pets with images, descriptions, and availability
- 📅 **Adoption Requests**
  - Users can apply to adopt pets directly from the platform
- 🏗 **Tech Stack**
  - **Frontend:** Next.js (React)
  - **Backend:** Spring Boot (Java, Spring Security, OAuth2)
  - **Database:** MySql
  - **Deployment:** NGINX, Docker, Google Cloud Platform (GCP)

---

## 📦 Installation & Setup

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/Baylor-SEII-Projects-Spring-2025/s25-pet-adoption-team-3
cd s25-pet-adoption-team-3
```


### **2️⃣ Backend Setup (Spring Boot + Gradle)**  

#### **Prerequisites**  

- Install **Java 23+**  
- Install **Docker**  


#### **Start the Backend Locally**  

1️⃣ **Start the Database** using Docker:  

```bash
docker compose -f docker/local.docker-compose.yml up -d
```  

2️⃣ **Set Active Profile to `dev`**:  

```bash
export SPRING_PROFILES_ACTIVE=dev
```  

3️⃣ **Run the Backend**:  

```bash
cd pet-adoption-api
./gradlew bootRun
```  


### **3️⃣ Frontend Setup (Next.js)**

#### **Prerequisites**

- Install **Node.js 23+**
- Install **Yarn 1.22+**

#### **Environment Variables**

Copy and rename `.env.example` to `.env.local` inside the `frontend/` directory:

```bash
cp pet-adoption-frontend/.env.local.example pet-adoption-frontend/.env.local
cp pet-adoption-frontend/.env.production.example pet-adoption-frontend/.production.local
```

Update the variable in .env.local to the local api url:

```env
NEXT_PUBLIC_API_BASE_URL=http://example:8080
```

For local testing, you can use replace `http://example:8080` with `http://localhost:8080` if you are running the backend locally.

Update the variable in .env.development to the development api url:

```env
NEXT_PUBLIC_API_BASE_URL=https://example.com
```

#### **Start the Frontend**

```bash
cd pet-adoption-frontend
yarn install
yarn dev
```

---

### **4️⃣ Google Secrets Manager Setup**

#### **Prerequisites**

- Install Google Cloud CLI
- Login to Google Cloud CLI
- Contact OAuth API Owner for IAM access

#### **Configure**

You will need to configure secrets manager in order to have access to OAuth as well as buckets.

Configure environment to use the dedicated GCP project:

```bash
gcloud config set project adopt-dont-shop-450021
```

Then test if you are able to retrieve a secret:

```env
gcloud secrets versions access latest --secret=google-client-id
```
---

## 🛠️ **Troubleshooting**  

### 🔄 **API Compiling Issues**  

- If you are receiving this error:  
  ```  
  org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'OAuthController': Injection of autowired dependencies failed  
  ```  
  - It means that you did not set `SPRING_PROFILES_ACTIVE` into your environment. Ensure that you have set:  
    ```bash
    export SPRING_PROFILES_ACTIVE=dev  
    ```  
    or  
    ```bash
    export SPRING_PROFILES_ACTIVE=prod  
    ```  
    depending on your use case.- 


- You may also set the environment variable in your IDE. For example, in IntelliJ, you can set it in the run configuration for the Spring Boot application.
  - In IntelliJ, go to `Run` > `Edit Configurations...` > `Environment Variables` and add `SPRING_PROFILES_ACTIVE=dev`.

---

## 📌 **Frontend Routing Table**  

| **Route**                 | **Component**        | **Description**                                     | **Access**                      |
|---------------------------|----------------------|-----------------------------------------------------|---------------------------------|
| `/`                       | `HomePage`          | Landing page with an overview and call-to-action.   | Public                          |
| `/about`                  | `AboutPage`         | Information about the platform and mission.         | Public                          |
| `/gallery`                | `GalleryPage`       | Gallery of adoptable pets.                          | Public                          |
| `/learn`                  | `LearnPage`         | Educational resources about pet adoption.           | Public                          |
| `/login`                  | `LoginPage`         | User authentication page (OAuth/Email).             | Public (redirects if logged in) |
| `/register`               | `RegisterPage`      | User signup page.                                   | Public (redirects if logged in) |
| `/forgot-password`        | `ForgotPasswordPage` | Password recovery page.                             | Public (redirects if logged in) |
| `/reset-password`        | `ResetPasswordPage`  | Password reset page.                                | Public (redirects if logged in) |
| `/profile`                | `ProfilePage`       | User profile settings and dashboard.                | Private (Auth required)         |
| `/adoption-center/dashboard` | `AdoptionCenterDashboardPage` | Dashboard for adoption center users.                | Private (Auth required)         |
| `/adoption-center/register` | `AdoptionCenterRegisterPage` | Adoption center registration page.                  | Private (Auth required)         |
| `/chat/:id`          | `ChatPage`          | Chat interface for user communication.              | Private (Auth required)         |
| `/chat`                  | `ChatListPage`      | List of user chats.                                 | Private (Auth required)         |
| `/my-pet/:petId` | `MyPetPage`         | Pet details for an adopted pet for logged-in users. | Private (Auth required)         |
| `/pet-info:petUUID` | `PetInfoPage`       | Detailed view of a specific pet.                    | Private (Auth required)         |
| `/view-event/:eventId` | `EventPage`         | Detailed view of a specific event.                  | Private (Auth required)         |
| `/view-event/adoption-center/:eventId` | `AdoptionCenterEventPage` | Detailed view of a specific event for adoption centers. | Private (Auth required)         |
| `/view-event/adoption-center/edit-event/:eventId` | `EditEventPage` | Edit event page for adoption centers.               | Private (Auth required)         |
| `/swipe`                | `SwipePage`         | Swipe interface for pet adoption.                   | Private (Auth required)         |
| `*`                       | `NotFoundPage`      | 404 page for undefined routes.                         | Public             |

---
