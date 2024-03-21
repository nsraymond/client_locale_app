document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(this);

    // Create an object from form data
    const loginData = {};
    formData.forEach(function(value, key) {
        loginData[key] = value;
    });

    // Make a POST request to the backend for login
    fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.ok) {
            // If login is successful, extract JWT token from response
            return response.json();
        } else {
            // If login fails, handle the error
            throw new Error('Login failed');
        }
    })
    .then(data => {
        // Save JWT token to localStorage with key 'x-api-key'
        localStorage.setItem('x-api-key', data.token);

        // Redirect to main page or any other desired page
        window.location.href = 'http://127.0.0.1:5500/pages/home/home.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login failed. Please check your credentials and try again.');
    });
});
