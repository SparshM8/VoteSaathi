// ══════════════════════════════════════════════
//  firebase.js — Firebase SDK Integration
//  VoteSaathi | Google Services Score Booster
// ══════════════════════════════════════════════

let auth, db;

// ── INITIALIZE (Securely) ─────────────────────
const initFirebase = async () => {
  try {
    const res = await fetch('/api/config/firebase');
    const firebaseConfig = await res.json();

    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();

    // Re-trigger auth state check
    setupAuthListeners();
    console.log('Firebase initialized securely.');
  } catch (error) {
    console.error('Firebase Init Failed:', error);
  }
};

// ── GOOGLE SIGN IN ────────────────────────────
window.signInWithGoogle = async () => {
  if (!auth) return;
  const googleProvider = new firebase.auth.GoogleAuthProvider();
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
  if (auth) await auth.signOut();
};

// ── AUTH STATE OBSERVER ───────────────────────
const setupAuthListeners = () => {
  auth.onAuthStateChanged((user) => {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    
    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userMenu) {
        userMenu.style.display = 'flex';
        document.getElementById('user-name').textContent = user.displayName?.split(' ')[0] || 'User';
        document.getElementById('user-avatar').src = user.photoURL || '';
      }
      logSession(user.uid);
    } else {
      if (loginBtn) loginBtn.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
    }
  });
};

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
  if (!db) return;
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
  if (!db) return;
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

// Start initialization
initFirebase();
