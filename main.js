const loginbtn = document.querySelector(".token")
const navloggedin = document.querySelector(".navloggedin")
const registerbtn = document.querySelector(".register")
const createpostbtn = document.querySelector(".create-post")
const token = localStorage.getItem("token")
const logouBtn = document.querySelector('#logout')
let currentpage = 1
let lastpage = 1
const urlpost = "https://tarmeezacademy.com/api/v1/posts"

function register() {
    const name = document.querySelector(".registernameinput").value;
    const username = document.querySelector(".registerusernameinput").value;
    const password = document.querySelector(".passwordinput").value;
    const image = document.querySelector(".imageinput").files[0]

    let formData = new FormData()
    formData.append("name", name),
        formData.append("username", username),
        formData.append("image", image),
        formData.append("password", password)

    axios.post("https://tarmeezacademy.com/api/v1/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then((Response) => {
        localStorage.setItem("token", Response.data.token)
        localStorage.setItem("user", JSON.stringify(Response.data.user))
        var registerModal = document.querySelector('.register-modal');
        var modal = bootstrap.Modal.getInstance(registerModal)
        modal.hide()
        setupui()
        showAlert("register a new user success")
    }).catch((Error) => {
        const message = Error.response.data.message
        showAlert(message, 'danger')
    })
}

function login() {
    const username = document.querySelector(".nameinput").value;
    const password = document.querySelector(".passwordinput").value;
    axios.post("https://tarmeezacademy.com/api/v1/login", {
        "username": username,
        "password": password
    }).then((Response) => {
        localStorage.setItem("token", Response.data.token)
        localStorage.setItem("user", JSON.stringify(Response.data.user))
        var myModal = document.querySelector('.login-modal');
        var modal = bootstrap.Modal.getInstance(myModal)
        modal.hide()
        setupui()
        showAlert("logged in success")
    })
}

function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setupui()
    showAlert("logged out success")
}

function showAlert(custommessage, type = "warning") {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    // const alertTrigger = document.getElementById('liveAlertBtn')
    // const alertlogout = document.getElementById('logoutBtn')
    // if (alertTrigger) {
    //     alertTrigger.addEventListener('click', () => {
    //         appendAlert('Nice, you are loggingin now', 'warning')
    // setTimeout(() => {
    //     const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
    //     alert.close()
    // }, 2000);
    // })
    // } else if (alertlogout) {
    //     alertlogout.addEventListener('click', () => {
    appendAlert(custommessage, type)
    // setTimeout(() => {
    //     const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
    //     alert.close()
    // }, 2000);
    // })
}

function setupui() {
    const token = localStorage.getItem("token")
    const login = document.querySelector(".loginbtn")
    const logout = document.querySelector(".navloggedin")
    const registerbtn = document.querySelector(".registerbtn")
    const addpost = document.querySelector(".add-post-btn")
    if (token != null) {
        if (addpost != null) {

            addpost.style.setProperty("display", "block", "important")
        }
        login.style.setProperty("display", "none", "important")
        registerbtn.style.setProperty("display", "none", "important")
        logout.style.setProperty("display", "flex", "important")
        let user = currentuser()
        document.querySelector(".nav-username").innerHTML = user.username
        document.querySelector(".navuserimg").src = user.profile_image
    } else {
        if (addpost != null) {

            addpost.style.setProperty("display", "none", "important")
        }
        login.style.setProperty("display", "flex", "important")
        registerbtn.style.setProperty("display", "flex", "important")
        logout.style.setProperty("display", "none", "important")
    }
}
setupui()
function currentuser() {
    let user = null
    const storageuser = localStorage.getItem("user")
    if (storageuser != null) {
        user = JSON.parse(storageuser)
        return user
    }
}

registerbtn.addEventListener("click", register)
loginbtn.addEventListener("click", login)
window.addEventListener("scroll", function () {
    const endpage = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
    if (endpage && currentpage < lastpage) {
        currentpage = currentpage + 1

        getpost(false, currentpage)
        console.log(endpage)
        navbar.classList.add('sticky')

    }
})








//     if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight){
//         loadImages();
//     }
