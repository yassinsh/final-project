// setupui()
userprofile()
postsuser()





function currentuserid() {
    const urlparams = new URLSearchParams(window.location.search)
    const id = urlparams.get("userid")
    return id
}

function userprofile() {
    const id = currentuserid()
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
        .then((response) => {
            console.log(response.data)
            document.querySelector(".img-userprofile").src = response.data.data.profile_image
            document.querySelector(".emailprofile").innerHTML = response.data.data.email
            document.querySelector(".usernameprofile").innerHTML = response.data.data.username
            document.querySelector(".nameprofile").innerHTML = response.data.data.name
            document.querySelector(".posttitle").innerHTML = response.data.data.name
            document.querySelector(".commentss-count").innerHTML = response.data.data.comments_count
            document.querySelector(".posts-count").innerHTML = response.data.data.posts_count
        })
}
function postsuser() {
    const id = currentuserid()

    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)

        .then((Response) => {
            const posts = Response.data.data

            for (post of posts) {
                let posttitle = ""
                let user = currentuser()
                let mypost = user != null && post.author.id == user.id
                let buttoncontent = ""
                if (mypost) {
                    buttoncontent = `
                        
                        <button class="btn btn-danger deletepost" onclick="deletepost('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
                        <button class="btn btn-secondary editpost" onclick="editpost('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
                        `
                }
                if (posttitle != null) {
                    posttitle = post.title
                }
                const author = post.author
                let content = `
            <div class="card my-3">
                 <div class="card-header">
                    <img src="${author.profile_image}" class="rounded img-user" alt="">
                    <b>${author.name}</b>
                    ${buttoncontent}
                 </div>
                <div class="card-body" onclick="onclicked(${post.id})">
                    <img src="${post.image}" class="img-body rounded w-100" alt="">
                    <h6 class="--bs-dark-text-emphasis">${post.created_at}</h6>
                    <h5 class="card-title">${posttitle}</h5>
                    <p class="card-text">${post.body}</p>
                    <hr>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-pen" viewBox="0 0 16 16">
                        <path
                            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                    </svg>
                    <a href="#"
                        class="link-dark link-underline-opacity-0 link-opacity-50 link-opacity-100-hover">(${post.comments_count})comment</a> 
                        <span id="tags">
                        <button class="btn btn-secondary ${post.tags.length ? '' : 'd-none'}">${post.tags.map(tag => tag.name).join(', ')}</button>
                    </span>
                        </div>
            </div>
                `

                document.querySelector(".postsuser").innerHTML += content
            }

        })
}