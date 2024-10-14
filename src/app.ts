import { envs } from "./configs/envs.config"
import { Server } from "./configs/server.config"
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