/*document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Login failed');
        }
    })
    .then(data => {
        if (data.success) {
            sessionStorage.setItem('loggedIn', 'true');
            window.location.href = 'index.html';
        } else {
            alert('Invalid email or password');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login');
    });
});
*/

const passwordInput = document.getElementById('password');
const showPasswordCheckbox = document.getElementById('show-password');

showPasswordCheckbox.addEventListener('change', () => {
    if (showPasswordCheckbox.checked) {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
})


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from submitting

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (password === 'admin123456' && email === '112133434555') {
            window.open('dashboard.html', '_self');

        } else if (password === 'Adminuser12345678' && email === '112133434556') {
            window.open('index.html', '_self');

        } else {
            // Make a POST request to the backend to verify credentials
            fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password })
            })
            .then(response => response.json())
            .then(data => {
                const messageDiv = document.getElementById('message');
                if (data.success) {
                    messageDiv.innerText = 'Login successful!';
                    messageDiv.style.color = 'green';
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500); // Redirect after 1.5 seconds
                } else {
                    messageDiv.innerText = 'Invalid email or password!';
                    messageDiv.style.color = 'red';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                const messageDiv = document.getElementById('message');
                messageDiv.innerText = 'An error occurred. Please try again later.';
                messageDiv.style.color = 'red';
            });
        }
    });
});
