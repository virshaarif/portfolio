
 const menuOpenButton=document.getElementById("menu-open-button");
   const menuCloseButton=document.getElementById("menu-close-button");
  function validateForm() {
    const name = document.querySelector("input[name='name']").value.trim();
    const email = document.querySelector("input[name='email']").value.trim();
    const message = document.querySelector("textarea[name='message']").value.trim();

    const namePattern = /^[A-Za-z\s]{3,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.match(namePattern)) {
      alert("⚠️ Please enter a valid name (at least 3 letters).");
      return false;
    }

    if (!email.match(emailPattern)) {
      alert("⚠️ Please enter a valid email address.");
      return false;
    }

    if (message.length < 10) {
      alert("⚠️ Your message should be at least 10 characters.");
      return false;
    }

    alert("✅ Message sent successfully!");
    return true; // Let form submit
  }

 const navMenu = document.getElementById("nav-menu");

 menuOpenButton.addEventListener("click", () => {
     navMenu.style.left = "0";
 });

 menuCloseButton.addEventListener("click", () => {
     navMenu.style.left = "-350px";
 });



 const navLinks = navMenu.querySelectorAll(".nav-links");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.style.left = "-350px";
      });
    });


  const scriptURL = 'https://script.google.com/macros/s/AKfycbymi4Wa74g9k6LHMJiGr8erQsffMwkLo8nhyg_Pr7-wlDHNaqA52o8AZsifqnrVoc_R/exec'
  const form = document.forms['submit-to-google-sheet']

  form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message))
  })
