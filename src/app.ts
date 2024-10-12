import { Server } from "./configs/server"
import { getDebugMode, getPort } from "./configs/envs"
import { AppRoutes } from "./routes/app.routes"

(() =>{
    main()
})()

async function main () {
    console.log("Starting API...")
    if(getDebugMode()){
        console.log("DEBUG MODE ON")
    }

    new Server({
        port: getPort(),
        routes: AppRoutes.routes
    }).start()
}