document.addEventListener("DOMContentLoaded", function() {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxbhre4UB3w80xkWv6_6ZaWsauvnRNV9H7gUUINrtahypJfYSD5uSkBRYVp-I29F8vR7w/exec';
  const form = document.forms['contact-form'];

  form.addEventListener('submit', e => {
    e.preventDefault();
    
    // Honeypot check
    if (form["honeypot"].value) {
      console.log("Honeypot detected. Not submitting form.");
      return; // Exit the function and do not submit
    }
    
    console.log("Name:", form["your-name"].value);
    console.log("Number:", form["your-number"].value);
    console.log("Email:", form["your-email"].value);
    console.log("Message:", form["message"].value);
    
    const formData = new FormData(form);
    
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    
    fetch(scriptURL, { method: 'POST',  body: formData })
      .then(response => {
        console.log('Server response:', response);
        alert("Thank you! The form is submitted successfully.");
      })
      //  .then(() => { window.location.reload(); })
      .catch(error => console.error('Error!', error.message));
  });
});
