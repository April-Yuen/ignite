document.querySelector('.like').addEventListener('click', likeStory)
document.querySelector('.notlike').addEventListener('click', notLikeStory)

async function likeStory(){
    const heartId = this.parentNode.dataset.id
    console.log(heartId)
    try {
        const response = await fetch('/igniteRoutes/storyLike', {
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
    const heartId = this.parentNode.dataset.id
    console.log(heartId)
    try {
        const response = await fetch('/igniteRoutes/storyNotLike', {
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
