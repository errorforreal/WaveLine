const loginForm = document.getElementById('loginForm');
const errorBox = document.getElementById('errorBox');

loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const payload = {
        email : document.getElementById('email').value,
        password : document.getElementById('password').value
    }

    try {

        const res = await fetch('/user/login', {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(payload)
        })

        const data = await res.json();

        if(!res.ok){
            throw new Error(data.message)
        }

        localStorage.setItem('authToken', data.loginToken);
        

        window.location.href = '/dashboard.html';
    }
    catch(err){
        console.log(err);
        
        errorBox.textContent = err.message;
    }
})