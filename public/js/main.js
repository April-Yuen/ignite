let notLikeBtn = document.querySelector('.like')
let likeBtn = document.querySelector('.notlike')

if(likeBtn){
    likeBtn.addEventListener('click', likeStory)
}else{
    notLikeBtn.addEventListener('click', notLikeStory)
}

async function likeStory(){
    const heartId = this.dataset.id
    console.log(heartId)
    try {
        const response = await fetch('/storyLike', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'IdFromJSFile': heartId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (error) {
        console.log(error)
    }
}

async function notLikeStory(){
    const heartId = this.dataset.id
    console.log(heartId)
    try {
        const response = await fetch('/notLikeStory', {
            method: 'put',
            headers: {'Content-type': 'application/json'}, 
            body: JSON.stringify({
                'IdFromJSFile': heartId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (error) {
        console.log(error)
    }
}
