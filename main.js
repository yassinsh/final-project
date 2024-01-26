const modalloginbtn = document.querySelector(".token")
const navloggedin = document.querySelector(".navloggedin")
const registerbtn = document.querySelector(".register")
const createpostbtn = document.querySelector(".create-post")
const token = localStorage.getItem("token")
const logoutBtn = document.querySelector('#logoutBtn')
let currentpage = 1
let lastpage = 1
const urlpost = "https://tarmeezacademy.com/api/v1/posts"


function profileclicked() {
    const user = currentuser()
    const userid = user.id
    window.location = `profile.html?userid=${userid}`

}
function editpost(postobject) {
    let post = JSON.parse(decodeURIComponent(postobject))
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-submit-btn").innerHTML = "update"
    document.querySelector("#modaltitleadd-edit").innerHTML = "edit post"
    document.querySelector(".titlenewpostinput").value = post.title
    document.querySelector(".bodynewpostinput").value = post.body
    const myModalEl = document.getElementById('new-post-Modal')
    const modal = new bootstrap.Modal(myModalEl)
    modal.toggle()
}
function deletepost(postobject) {
    let post = JSON.parse(decodeURIComponent(postobject))
    document.getElementById("delete-input-id").value = post.id
    const myModalEl = document.getElementById('delete-post-Modal')
    const modal = new bootstrap.Modal(myModalEl)
    modal.toggle()
}
function confirmdeletepost() {
    const token = localStorage.getItem("token")

    let postid = document.getElementById("delete-input-id").value
    console.log(postid)
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postid}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then((Response) => {
        var deleteModal = document.querySelector('.delete-post-modal');
        var modal = bootstrap.Modal.getInstance(deleteModal)
        modal.hide()
        getposts()
        setupui()
        showAlert("delete post success")
    })
        .catch((Error) => {
            const message = Error.Response.data.message
            showAlert(message, 'danger')
            console.log(message)
        })
}
function createnewpost() {
    createpostbtn.addEventListener("click", () => {
        let postid = document.getElementById("post-id-input").value
        let iscreat = postid == null || postid == ""
        const title = document.querySelector(".titlenewpostinput").value;
        const body = document.querySelector(".bodynewpostinput").value;
        const image = document.querySelector(".imagenewpostinput").files[0];
        const token = localStorage.getItem("token")
        let formData = new FormData()
        formData.append("title", title),
            formData.append("body", body),
            formData.append("image", image)
        if (iscreat) {

            axios.post("https://tarmeezacademy.com/api/v1/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": `Bearer ${token}`
                }
            }).then((Response) => {
                console.log("dfddf")
                console.log(Response)
                var createModal = document.querySelector('.add-post-modal');
                var modal = bootstrap.Modal.getInstance(createModal)
                modal.hide()
                getposts()
                setupui()
                showAlert("added new post success")
            })
                .catch((Error) => {
                    const message = Error.response.data.message
                    showAlert(message, 'danger')
                })
        }
        else {
            // formData.append("_method", "put")
            formData.append("_method", "put")


            axios.post(`https://tarmeezacademy.com/api/v1/posts/${postid}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": `Bearer ${token}`
                }
            }).then((Response) => {
                var createModal = document.querySelector('.add-post-modal');
                console.log(Response)
                var modal = bootstrap.Modal.getInstance(createModal)
                modal.hide()
                getposts()
                setupui()
                showAlert("update post success")
            })
                .catch((Error) => {
                    const message = Error.response.data.message
                    showAlert(message, 'danger')
                })
        }
    })
}
createnewpost()
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
        console.log("yes")
        localStorage.setItem("token", Response.data.token)
        localStorage.setItem("user", JSON.stringify(Response.data.user))
        var registerModal = document.querySelector('.register-modal');
        var modal = bootstrap.Modal.getInstance(registerModal)
        modal.hide()
        setupui()
        showAlert("register a new user success")
    }).catch((Error) => {
        console.log("no")
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
        console.log("login")
        localStorage.setItem("token", Response.data.token)
        localStorage.setItem("user", JSON.stringify(Response.data.user))
        var myModal = document.querySelector('.login-modal');
        var modal = bootstrap.Modal.getInstance(myModal)
        modal.hide()
        setupui()
        showAlert("logged in success")
    }).catch((Error) => {
        console.log("no")
        const message = Error.response.data.message
        showAlert(message, 'danger')
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
    const logout = document.querySelector("#logoutBtn")
    const registerbtn = document.querySelector(".registerbtn")
    const addpost = document.querySelector(".add-post-btn")
    let user = currentuser()
    const navusername = document.querySelector(".nav-username").innerHTML = user.username
    const navprofileimg = document.querySelector(".navuserimg").src = user.profile_image
    if (token != null) {
        if (addpost != null) {

            addpost.style.setProperty("display", "block", "important")
        }
        login.style.setProperty("display", "none", "important")
        registerbtn.style.setProperty("display", "none", "important")
        logout.style.setProperty("display", "flex", "important")
        console.log(navusername)
        navusername.style.setProperty("display", "flex", "important")
        navprofileimg.style.setProperty("display", "inline-block", "important")
    } else {
        if (addpost != null) {

            addpost.style.setProperty("display", "none", "important")
        }
        login.style.setProperty("display", "flex", "important")
        registerbtn.style.setProperty("display", "flex", "important")
        logout.style.setProperty("display", "none", "important")
        navusername.style.setProperty("display", "none", "important")
        navprofileimg.style.setProperty("display", "none", "important")
    }
}
setupui()
function currentuser() {
    let user = null
    const storageuser = localStorage.getItem("user")
    if (storageuser != null) {
        user = JSON.parse(storageuser)
        return user
    } else {
        console.log("eeeee")
    }
}


function addnewpost() {
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modal-submit-btn").innerHTML = "create"
    document.querySelector("#modaltitleadd-edit").innerHTML = "create a new post"
    document.querySelector(".titlenewpostinput").value = ""
    document.querySelector(".bodynewpostinput").value = ""
    const myModalEl = document.getElementById('new-post-Modal')
    const modal = new bootstrap.Modal(myModalEl)
    modal.toggle()
}

registerbtn.addEventListener("click", register)
// loginbtn.addEventListener("click", login)
logoutBtn.addEventListener("click", logout)
modalloginbtn.addEventListener("click", login)
window.addEventListener("scroll", function () {
    let navbar = this.document.querySelector(".navbar")
    const endpage = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
    if (endpage && currentpage < lastpage) {
        currentpage = currentpage + 1

        getposts(false, currentpage)
        console.log(endpage)
        navbar.classList.add('sticky-top')

    }
})