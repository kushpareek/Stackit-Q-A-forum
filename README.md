
# StackIt - A Minimal Q&A Forum

![StackIt Screenshot](https://i.imgur.com/example.png) <!-- It's a good idea to replace this with an actual screenshot of your app -->

StackIt is a minimal, user-friendly question-and-answer platform built with modern web technologies. It's designed to support collaborative learning and structured knowledge sharing, focusing on the core experience of asking and answering questions within a community.

## Core Features

- **Ask & Answer:** Users can post questions with a rich text editor and answer questions from others.
- **Rich Text Editor:** A full-featured editor supporting bold, italics, lists, links, images, and more.
- **Voting System:** Upvote or downvote answers to highlight the most helpful solutions.
- **Accepted Answers:** Question authors can mark one answer as the accepted solution.
- **Tagging:** Organize questions with multiple tags for easy discovery.
- **User Profiles:** View user profiles with stats for reputation, questions, and answers.
- **Real-time Backend:** Powered by Firebase for live data updates and secure authentication.
- **Responsive Design:** A clean, responsive UI built with Tailwind CSS.

## Tech Stack

- **Frontend:** [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Rich Text Editor:** [Quill.js](https://quilljs.com/)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have a code editor (like VS Code) and a modern web browser. This project uses CDN links for its main dependencies, so no `npm install` is required for the frontend libraries.

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/your-username/stackit.git
cd stackit
```

### 2. Firebase Setup (Crucial Step)

This application requires a Firebase project to handle the backend, database, and user authentication.

**Step 1: Create a Firebase Project**
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click on **"Add project"** and follow the on-screen instructions to create a new project. Give it a name like `stackit-dev`.

**Step 2: Create a Web App in Firebase**
1. In your new project's dashboard, click the web icon (`</>`) to add a new web app.
2. Give your app a nickname (e.g., "StackIt Web") and click **"Register app"**.
3. Firebase will provide you with a `firebaseConfig` object. **Copy this object.**

**Step 3: Configure the Application**
1. In the project's code, navigate to `firebase/config.ts`.
2. Replace the existing placeholder `firebaseConfig` object with the one you copied from your Firebase project.

**Step 4: Enable Authentication**
1. In the Firebase Console, go to the **Authentication** section (under the "Build" menu).
2. Click **"Get started"**.
3. Go to the **"Sign-in method"** tab, select **"Email/Password"** from the list, enable it, and click **Save**.

**Step 5: Set up Firestore Database**
1. In the Firebase Console, go to the **Firestore Database** section.
2. Click **"Create database"**.
3. Start in **Production mode**.
4. Choose a location for your database (choose the one closest to you).
5. Click **Enable**.

**Step 6: Set Firestore Security Rules**
This is a critical step. By default, no one can read or write to your database.
1. In the Firestore section of the console, go to the **"Rules"** tab.
2. Replace the entire content with the following rules, which allow public read access but restrict writing to authenticated users.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access on all documents
    match /{document=**} {
      allow read: if true;
    }

    // Allow authenticated users to create/update their own content
    match /questions/{questionId} {
      allow create, update: if request.auth.uid == request.resource.data.authorId;
    }
    match /answers/{answerId} {
      allow create, update: if request.auth.uid == resource.data.authorId;
    }
    match /users/{userId} {
      allow create, update: if request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**.

### 3. Run the Application

Since this project doesn't have a local build step, you can run it using a simple local server. If you have VS Code, the **Live Server** extension is a great option.

1.  Open the project folder in VS Code.
2.  Right-click on `index.html`.
3.  Select **"Open with Live Server"**.

Your application should now be running in your browser and fully connected to your Firebase backend!

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details (if you choose to add one).
