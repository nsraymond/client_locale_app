document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(this);

    // Create an object from form data
    const userData = {};
    formData.forEach(function(value, key) {
        userData[key] = value;
    });

    // Make a POST request to the backend for signup
    fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            // If signup is successful, extract JWT token from response
            return response.json();
        } else {
            // If signup fails, handle the error
            throw new Error('Signup failed');
        }
    })
    .then(data => {
        // Save JWT token to localStorage with key 'x-api-key'
        localStorage.setItem('x-api-key', data.token);

        // Redirect to home page or any other desired page
        window.location.href = 'http://127.0.0.1:5500/pages/home/home.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Signup failed. Please try again.');
    });
});
