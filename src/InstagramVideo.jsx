import { useEffect } from "react"

function InstagramVideo(){

useEffect(()=>{

const script=document.createElement("script")

script.src="//www.instagram.com/embed.js"
script.async=true

document.body.appendChild(script)

},[])

return(

<div className="instagram-wrapper">

<blockquote
className="instagram-media"
data-instgrm-permalink="https://www.instagram.com/reel/DSaHaoZAAlg/"
data-instgrm-version="14"
style={{width:"100%"}}
>
</blockquote>

</div>

)

}

export default InstagramVideo