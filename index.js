const root=document.documentElement;
const header=document.querySelector(".site-header");

// Mobile menu
const menuToggle=document.getElementById("menu-toggle");
const navLinks=document.getElementById("nav-links");
function setMenu(open)
{
    navLinks.classList.toggle("open",open);
    menuToggle.setAttribute("aria-expanded",String(open));
    menuToggle.setAttribute("aria-label",open?"Close menu":"Open menu");
}
menuToggle.addEventListener("click",()=>
{
    setMenu(!navLinks.classList.contains("open"));
});
navLinks.addEventListener("click",(event)=>
{
    if(event.target.closest("a"))
    {
        setMenu(false);
    }
});
document.addEventListener("click",(event)=>
{
    if(navLinks.classList.contains("open") && !header.contains(event.target))
    {
        setMenu(false);
    }
});
document.addEventListener("keydown",(event)=>
{
    if(event.key==="Escape" && navLinks.classList.contains("open"))
    {
        setMenu(false);
        menuToggle.focus();
    }
});
window.matchMedia("(min-width: 901px)").addEventListener("change",(event)=>
{
    if(event.matches)
    {
        setMenu(false);
    }
});

// Theme: the inline script in <head> sets the starting theme, this keeps the button and browser bar in sync.
const themeToggle=document.getElementById("theme-toggle");
const themeColor=document.querySelector('meta[name="theme-color"]');
const systemDark=window.matchMedia("(prefers-color-scheme: dark)");
function applyTheme(mode)
{
    root.dataset.theme=mode;
    themeToggle.setAttribute("aria-label",mode==="dark"?"Switch to light theme":"Switch to dark theme");
    themeColor.setAttribute("content",mode==="dark"?"#211815":"#F7F1E8");
}
applyTheme(root.dataset.theme);
themeToggle.addEventListener("click",()=>
{
    const next=root.dataset.theme==="dark"?"light":"dark";
    applyTheme(next);
    localStorage.setItem("theme",next);
});
systemDark.addEventListener("change",(event)=>
{
    // Follow the system setting only until the visitor picks a theme themselves.
    if(!localStorage.getItem("theme"))
    {
        applyTheme(event.matches?"dark":"light");
    }
});

// Highlight the nav link of the section currently in view
const navAnchors=[...navLinks.querySelectorAll("a")];
function setActive(id)
{
    navAnchors.forEach((link)=>
    {
        const isActive=link.getAttribute("href")==="#"+id;
        link.classList.toggle("active",isActive);
        if(isActive)
        {
            link.setAttribute("aria-current","true");
        }
        else
        {
            link.removeAttribute("aria-current");
        }
    });
}
const sectionObserver=new IntersectionObserver((entries)=>
{
    entries.forEach((entry)=>
    {
        if(entry.isIntersecting)
        {
            setActive(entry.target.id);
        }
    });
},{rootMargin:"-45% 0px -50% 0px"});
document.querySelectorAll("main section[id]").forEach((section)=>sectionObserver.observe(section));

// Contact form: validate, then open the visitor's email app with the message filled in
const form=document.getElementById("contact-form");
const nameInput=document.getElementById("name");
const emailInput=document.getElementById("email");
const messageInput=document.getElementById("message");
const formStatus=document.getElementById("form-status");

function fieldError(input)
{
    const value=input.value.trim();
    if(input===nameInput && value==="")
    {
        return "Please enter your name.";
    }
    if(input===emailInput)
    {
        if(value==="")
        {
            return "Please enter your email.";
        }
        if(input.validity.typeMismatch)
        {
            return "Please enter a valid email, like name@example.com.";
        }
    }
    if(input===messageInput && value==="")
    {
        return "Please enter a message.";
    }
    return "";
}
function showError(input,message)
{
    document.getElementById(input.id+"-error").textContent=message;
    input.setAttribute("aria-invalid",message?"true":"false");
}

[nameInput,emailInput,messageInput].forEach((input)=>
{
    // Once a field has been flagged, clear the error as soon as it is fixed.
    input.addEventListener("input",()=>
    {
        if(input.getAttribute("aria-invalid")==="true")
        {
            showError(input,fieldError(input));
        }
    });
});

form.addEventListener("submit",(event)=>
{
    event.preventDefault();
    formStatus.textContent="";

    const inputs=[nameInput,emailInput,messageInput];
    let firstInvalid=null;
    inputs.forEach((input)=>
    {
        const message=fieldError(input);
        showError(input,message);
        if(message && !firstInvalid)
        {
            firstInvalid=input;
        }
    });

    if(firstInvalid)
    {
        formStatus.textContent="Please fix the highlighted fields.";
        firstInvalid.focus();
        return;
    }

    const name=nameInput.value.trim();
    const email=emailInput.value.trim();
    const subject="Portfolio message from "+name;
    const body=messageInput.value.trim()+"\n\n"+name+" ("+email+")";
    window.location.href="mailto:"+form.dataset.email+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
    formStatus.textContent="Your email app is opening with this message. Press send there to deliver it.";
});

document.getElementById("year").textContent=new Date().getFullYear();
