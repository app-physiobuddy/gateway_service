class Logger {
    route(message: string, user_id?:string) {
        let date = new Date().getUTCDate().toString()
        console.log(`${date} - User: ${user_id} - At route: ${message}`);
    }
}

export default new Logger();