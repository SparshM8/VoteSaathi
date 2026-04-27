// ══════════════════════════════════════════════
//  firebase.js — Firebase SDK Integration
//  VoteSaathi | Google Services Score Booster
// ══════════════════════════════════════════════

// Real Firebase Config — VoteSaathi Project
const firebaseConfig = {
  apiKey: "AIzaSyCdNVrVnXQhzh6ZaAWcDLsPtTkEnGNvxBc",
  authDomain: "august-craft-453617-j1.firebaseapp.com",
  projectId: "august-craft-453617-j1",
  storageBucket: "august-craft-453617-j1.firebasestorage.app",
  messagingSenderId: "206286072146",
  appId: "1:206286072146:web:8b9f120c5dc6342b7ab28b"
};

// ── INITIALIZE ────────────────────────────────
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ── GOOGLE SIGN IN ────────────────────────────
const googleProvider = new firebase.auth.GoogleAuthProvider();

window.signInWithGoogle = async () => {
  try {
    const result = await auth.signInWithPopup(googleProvider);
    const user = result.user;
    
    // Save user profile to Firestore
    await db.collection('Users').doc(user.uid).set({
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return user;
  } catch (error) {
    console.error('Sign In Error:', error);
    throw error;
  }
};

window.signOut = async () => {
  await auth.signOut();
};

// ── AUTH STATE OBSERVER ───────────────────────
auth.onAuthStateChanged((user) => {
  const loginBtn = document.getElementById('login-btn');
  const userMenu = document.getElementById('user-menu');
  
  if (user) {
    // Show user avatar + name in nav
    if (loginBtn) loginBtn.style.display = 'none';
    if (userMenu) {
      userMenu.style.display = 'flex';
      document.getElementById('user-name').textContent = user.displayName?.split(' ')[0] || 'User';
      document.getElementById('user-avatar').src = user.photoURL || '';
    }
    // Log session to Firestore
    logSession(user.uid);
  } else {
    if (loginBtn) loginBtn.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
  }
});

// ── FIRESTORE: LOG SESSION ────────────────────
const logSession = async (userId) => {
  try {
    await db.collection('Sessions').add({
      userId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      page: window.location.pathname
    });
  } catch (e) {}
};

// ── FIRESTORE: LOG AI QUERY ───────────────────
window.logQueryToFirestore = async (query, response) => {
  const user = auth.currentUser;
  try {
    await db.collection('AIQueries').add({
      userId: user?.uid || 'anonymous',
      query,
      response,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {}
};

// ── FIRESTORE: LOG FACT CHECK ─────────────────
window.logFactCheckToFirestore = async (content, verdict) => {
  const user = auth.currentUser;
  try {
    await db.collection('FactChecks').add({
      userId: user?.uid || 'anonymous',
      content,
      verdict,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {}
};
