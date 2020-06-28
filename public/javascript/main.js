$(function() {
    $('select').selectric();
});

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

document.querySelector( '#reminder-form' ).addEventListener( 'submit', ( e ) => {
    e.preventDefault()

    let [ email, duration, time ] = e.target.children

    email    = email.value
    duration = duration.querySelector( 'select' ).value
    time     = time.value
    
    const errors = document.querySelector( '.errors' ),
          success = document.querySelector( '.success' )

    errors.innerText  = ''
    success.innerText = ''

    if( ! validateEmail( email ) ) {
        errors.innerText = `That's not an email`
        return
    }

    errors.innerText  = ''
    success.innerText = 'Success! An email has been sent for verification'

    axios.post('/insert-user', {
            email,
            duration,
            time
        })
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });

})