// Firebase Configuration - To be filled by the user
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase if config is valid
if (firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    const loginBtn = document.getElementById('login-btn');
    const authContainer = document.getElementById('auth-container');

    loginBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {
                console.log('User signed in:', result.user);
            }).catch((error) => {
                console.error('Auth error:', error);
            });
    });

    auth.onAuthStateChanged((user) => {
        const dashboard = document.getElementById('dashboard');
        const userGreeting = document.getElementById('user-greeting');
        
        if (user) {
            authContainer.innerHTML = `
                <div class="user-profile">
                    <img src="${user.photoURL}" alt="${user.displayName}" class="avatar">
                    <span>${user.displayName.split(' ')[0]}</span>
                    <button id="logout-btn" class="btn btn-outline">Logout</button>
                </div>
            `;
            if (dashboard) dashboard.style.display = 'block';
            if (userGreeting) userGreeting.textContent = `Welcome back, ${user.displayName.split(' ')[0]}!`;
            
            document.getElementById('logout-btn').addEventListener('click', () => {
                auth.signOut();
            });
        } else {
            authContainer.innerHTML = `<button id="login-btn" class="btn btn-outline"><i class="fab fa-google"></i> Login with Google</button>`;
            if (dashboard) dashboard.style.display = 'none';
        }
    });
} else {
    console.warn('Firebase configuration not found. Authentication will be disabled.');
}
