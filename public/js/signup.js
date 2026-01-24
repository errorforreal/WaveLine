const form = document.getElementById('signupForm');
const errorBox = document.getElementById('errorBox');

form.addEventListener('submit',async (e)=>{
    e.preventDefault();

    const payload = {
        name : document.getElementById('name').value,
        email : document.getElementById('email').value,
        password : document.getElementById('password').value
    };

    try{
        const res = await fetch('/user/signup', {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(payload)
        })

        const data = await res.json();

        if(!res.ok){
            throw new Error(data.error); 
        }

        window.location.href = '/login.html';
    }
    catch(error){
        console.log(error);
        
        errorBox.textContent = error.message;
    }

    
})
