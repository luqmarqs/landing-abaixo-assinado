import { useLocation } from "react-router-dom"
import { useEffect } from "react"

function AnalyticsTracker(){

const location = useLocation()

useEffect(()=>{

window.gtag('config','G-XXXXXXX',{
page_path: location.pathname
})

},[location])

return null
}

export default AnalyticsTracker