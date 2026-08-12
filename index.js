const menuToggle=document.getElementById("menu-toggle");
const navLinks=document.getElementById("nav-links");
menuToggle.addEventListener("click",()=>{
    navLinks.classList.toggle("open");
})
const themeToggle=document.getElementById("theme-toggle");
function applytheme(mode)
{
    document.body.classList.toggle("dark",mode==="dark");
    themeToggle.textContent=mode==="dark"?"☀️":"🌙";
}
applytheme("light");
themeToggle.addEventListener("click",()=>
{
    const next=document.body.classList.contains("dark")?"light":"dark";
    applytheme(next);
})
const form=document.getElementById("contact-form");
form.addEventListener("submit",(event)=>
{
    event.preventDefault();
    document.getElementById("name-error").textContent="";
    document.getElementById("email-error").textContent="";
    document.getElementById("message-error").textContent="";
    document.getElementById("form-status").textContent="";

    const name=document.getElementById("name").value;
    const email=document.getElementById("email").value;
    const msg=document.getElementById("message").value;

    let isvalid=true;
    if(name==="")
    {
        document.getElementById("name-error").textContent="Please Enter your name!";
        isvalid=false;
    }
    if(email==="")
    {
        document.getElementById("email-error").textContent="Please Enter your email!";
        isvalid=false;
    }
    else if(!email.includes("@"))
    {
        document.getElementById("email-error").textContent="Please Enter a valid email!";
        isvalid=false;
    }
    if(msg==="")
    {
        document.getElementById("message-error").textContent="Please Enter a message!";
        isvalid=false;
    }
    if(isvalid)
    {
        document.getElementById("form-status").textContent="Message submitted successfully!";
        form.reset();
    }
    else
    {
        document.getElementById("form-status").textContent="Please fix the errors and submit a message!";
        form.reset();
    }
});