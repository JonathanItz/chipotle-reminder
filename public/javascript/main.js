$(function() {
    $('select').selectric();
});

if( document.querySelector( '#reminder-form' ) ) {
    document.querySelector( '#reminder-form' ).addEventListener( 'submit', ( e ) => {
        e.preventDefault()

        let [ email, duration, time ] = e.target.children

        // Get values
        email    = email.value
        duration = duration.querySelector( 'select' ).value
        time     = time.value
        
        // Get the error/success elements to later show the results message
        const errors = document.querySelector( '.errors' ),
            success = document.querySelector( '.success' )

        // Reset strings
        errors.innerText  = ''
        success.innerText = ''

        axios.post('/insert-user', {
                email,
                duration,
                time
            })
            .then( response => {
                
                if( response.data.status ) {
                    success.innerText = 'Success! An email has been sent for verification'
                } else {
                    errors.innerText = response.data.reason
                }
                console.log(response);
                
            }, error => {
                errors.innerText = 'An error occurred...'
                console.log(error);
            });

    })
}