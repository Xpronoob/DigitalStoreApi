import { Server } from "./configs/server"
import { envs } from "./configs/envs"
import { AppRoutes } from "./routes/app.routes"

(() =>{
    main()
})()

async function main () {
    console.log("Starting API...")
    if(envs.DEBUG_MODE){
        console.log("DEBUG MODE ON")
    }

    new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    }).start()
}