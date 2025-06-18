document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const toggleBtn = document.getElementById('dark-mode-toggle');
  const createPostSection = document.getElementById('create-post-section');

  // Panels
  const contactPanel = document.getElementById('contact-panel');
  const aboutPanel = document.getElementById('about-panel');

  // Nav links
  const navContact = document.getElementById('nav-contact');
  const navAbout = document.getElementById('nav-about');
  const navHome = document.getElementById('nav-home');

  // Recent posts and archive lists (assumed to exist in HTML)
  const recentPostsList = document.getElementById('recent-posts-list');
  const postsArchiveList = document.getElementById('posts-archive-list');

  // Dark mode load
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    toggleBtn.textContent = 'Light Mode';
  }

  // Dark mode toggle
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      toggleBtn.textContent = 'Light Mode';
      localStorage.setItem('darkMode', 'enabled');
    } else {
      toggleBtn.textContent = 'Dark Mode';
      localStorage.setItem('darkMode', 'disabled');
    }
  });

  // Helper to hide all panels
  function hideAllPanels() {
    contactPanel.style.display = 'none';
    aboutPanel.style.display = 'none';
  }

  // Contact toggle
  navContact.addEventListener('click', (e) => {
    e.preventDefault();
    if (contactPanel.style.display === 'block') {
      contactPanel.style.display = 'none';
    } else {
      hideAllPanels();
      contactPanel.style.display = 'block';
      contactPanel.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // About toggle
  navAbout.addEventListener('click', (e) => {
    e.preventDefault();
    if (aboutPanel.style.display === 'block') {
      aboutPanel.style.display = 'none';
    } else {
      hideAllPanels();
      aboutPanel.style.display = 'block';
      aboutPanel.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Home hides all
  navHome.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllPanels();
  });

  // ===== LOGIN + SIGNUP MODAL LOGIC =====

  const authModal = document.getElementById('auth-modal');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const showLoginBtn = document.getElementById('show-login');
  const showSignupBtn = document.getElementById('show-signup');
  const authCloseBtn = document.getElementById('auth-close');

  const loginError = document.getElementById('login-error');
  const signupError = document.getElementById('signup-error');
  const signupSuccess = document.getElementById('signup-success');
  const loginSuccess = document.getElementById('login-success');

  const loginBtn = document.getElementById('login-btn');

  // Create a profile panel dynamically and append it (hidden initially)
  let profilePanel = document.createElement('div');
  profilePanel.id = 'profile-panel';
  profilePanel.style.display = 'none';
  profilePanel.style.margin = '20px';
  profilePanel.style.padding = '10px';
  profilePanel.style.border = '1px solid #333';
  profilePanel.style.background = '#f0f0f0';
  profilePanel.style.maxWidth = '300px';
  profilePanel.style.fontFamily = 'Arial, sans-serif';
  profilePanel.style.position = 'absolute';
  profilePanel.style.top = '50px';
  profilePanel.style.right = '20px';
  profilePanel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  profilePanel.style.borderRadius = '8px';
  profilePanel.style.zIndex = '1000';

  profilePanel.innerHTML = `
    <p>Welcome, <strong><span id="profile-username"></span></strong>!</p>
    <div style="margin-top: 10px;">
      <button id="settings-btn" style="padding: 8px 12px; margin-right: 10px; cursor: pointer;">Settings</button>
      <button id="logout-btn" style="padding: 8px 12px; cursor: pointer;">Logout</button>
    </div>
  `;

  loginBtn.parentNode.insertBefore(profilePanel, loginBtn.nextSibling);

  const profileUsernameSpan = profilePanel.querySelector('#profile-username');
  const logoutBtn = profilePanel.querySelector('#logout-btn');
  const settingsBtn = profilePanel.querySelector('#settings-btn');

  settingsBtn.addEventListener('click', () => {
    alert('Settings clicked! You can add your settings page or modal here.');
  });

  function getUsersDB() {
    return JSON.parse(localStorage.getItem('usersDB') || '{}');
  }

  function saveUsersDB(users) {
    localStorage.setItem('usersDB', JSON.stringify(users));
  }

  // -- Post related helper functions --

  function createPostElement(title, content) {
    const article = document.createElement('article');
    article.classList.add('post');

    const h4 = document.createElement('h4');
    h4.textContent = title;
    article.appendChild(h4);

    const p = document.createElement('p');
    p.textContent = content.length > 100 ? content.substring(0, 100) + '…' : content;
    article.appendChild(p);

    return article;
  }

  function loadArchivedPosts() {
    const archivedPosts = JSON.parse(localStorage.getItem('postsArchive')) || [];
    postsArchiveList.innerHTML = '';
    archivedPosts.forEach(post => {
      postsArchiveList.appendChild(createPostElement(post.title, post.content));
    });
  }

  function addNewPost(title, content) {
    // Add to Recent Posts at top
    if (recentPostsList) {
      recentPostsList.prepend(createPostElement(title, content));
    }

    // Save to archive in localStorage
    let archivedPosts = JSON.parse(localStorage.getItem('postsArchive')) || [];
    archivedPosts.unshift({ title, content }); // add to start
    localStorage.setItem('postsArchive', JSON.stringify(archivedPosts));

    // Update archive visually (prepend)
    if (postsArchiveList) {
      postsArchiveList.prepend(createPostElement(title, content));
    }
  }

  function updateCreatePostVisibility() {
    if (!createPostSection) return;
    if (localStorage.getItem('loggedInUser')) {
      createPostSection.style.display = 'block';
    } else {
      createPostSection.style.display = 'none';
    }
  }

  function setLoggedIn(username) {
    localStorage.setItem('loggedInUser', username);
    loginBtn.textContent = 'Profile';
    profileUsernameSpan.textContent = username;
    profilePanel.style.display = 'none'; // hide on login button click toggle
    updateCreatePostVisibility();
  }

  function setLoggedOut() {
    localStorage.removeItem('loggedInUser');
    loginBtn.textContent = 'Login';
    profilePanel.style.display = 'none';
    updateCreatePostVisibility();
  }

  function showLogin() {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    showLoginBtn.style.background = '#663399';
    showLoginBtn.style.color = '#fff';
    showSignupBtn.style.background = '#ccc';
    showSignupBtn.style.color = '#333';

    loginError.style.display = 'none';
    signupError.style.display = 'none';
    signupSuccess.style.display = 'none';
    loginSuccess.style.display = 'none';
  }

  function showSignup() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    showSignupBtn.style.background = '#663399';
    showSignupBtn.style.color = '#fff';
    showLoginBtn.style.background = '#ccc';
    showLoginBtn.style.color = '#333';

    loginError.style.display = 'none';
    signupError.style.display = 'none';
    signupSuccess.style.display = 'none';
    loginSuccess.style.display = 'none';
  }

  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    setLoggedIn(loggedInUser);
  }

  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const user = localStorage.getItem('loggedInUser');

    if (user) {
      if (profilePanel.style.display === 'block') {
        profilePanel.style.display = 'none';
      } else {
        profilePanel.style.display = 'block';
        authModal.style.display = 'none';
      }
    } else {
      authModal.style.display = 'flex';
      showLogin();
    }
  });

  authCloseBtn.addEventListener('click', () => {
    authModal.style.display = 'none';
    loginForm.reset();
    signupForm.reset();
    loginError.style.display = 'none';
    signupError.style.display = 'none';
    signupSuccess.style.display = 'none';
    loginSuccess.style.display = 'none';
    profilePanel.style.display = 'none'; // hide on modal close
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    const usersDB = getUsersDB();

    loginError.style.display = 'none';
    loginSuccess.style.display = 'none';

    if (usersDB[username] && usersDB[username].password === password) {
      loginSuccess.textContent = `Login successful! Welcome, ${username}.`;
      loginSuccess.style.display = 'block';

      setLoggedIn(username);
      loginForm.reset();

      setTimeout(() => {
        authModal.style.display = 'none';
        loginSuccess.style.display = 'none';
        profilePanel.style.display = 'none'; // ensure profile is hidden on first login
      }, 2000);
    } else {
      loginError.style.display = 'block';
      loginError.textContent = 'Invalid username or password.';
    }
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    const usersDB = getUsersDB();

    if (usersDB[username]) {
      signupError.style.display = 'block';
      signupError.textContent = 'Username already exists.';
      signupSuccess.style.display = 'none';
    } else {
      usersDB[username] = { password, email };
      saveUsersDB(usersDB);

      signupError.style.display = 'none';
      signupSuccess.style.display = 'block';
      signupSuccess.textContent = 'Sign up successful! Please log in.';
      signupForm.reset();

      setTimeout(() => {
        showLogin();
      }, 1500);
    }
  });

  showLoginBtn.addEventListener('click', showLogin);
  showSignupBtn.addEventListener('click', showSignup);

  logoutBtn.addEventListener('click', () => {
    setLoggedOut();
    alert('You have been logged out.');
    profilePanel.style.display = 'none'; // hide panel after logout
  });

  // Load archived posts on page load
  loadArchivedPosts();

  // Update create post form visibility on page load
  updateCreatePostVisibility();

  // Create post form handler
  const createPostForm = document.getElementById('create-post-form');
  if (createPostForm) {
    createPostForm.addEventListener('submit', (e) => {
      e.preventDefault();  // Prevent form submission from refreshing page
      
      const title = createPostForm.elements['title'].value.trim();
      const content = createPostForm.elements['content'].value.trim();
      
      if (!title || !content) {
        alert('Please fill in both title and content.');
        return;
      }

      addNewPost(title, content);

      // Reset form after submission
      createPostForm.reset();

      alert('Post created successfully!');
    });
  }
});
