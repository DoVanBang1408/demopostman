import{ admin} from "../config/firebase"
class NotificationService {
    static async sendNotification(deviceToken: string, title: string, body: string) {
        const message = {
            notification: {
                title, body
            },
             token: deviceToken
        }

        try {
            const response = admin.messaging().send(message)
            return response
        } catch (error) {
            throw error
        }
    }
}

export default NotificationService;