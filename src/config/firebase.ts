import * as admin from "firebase-admin";
import { BaseMessage, Message, MulticastMessage, getMessaging } from 'firebase-admin/messaging';

export async function sendNotification(UUID: string) {
  try {
    console.log("test")
    let params: NotificationPayloadToSpecificDevice = {
      fcmToken: UUID,
      notification: {
        title: "Thông báo",
        body: "Không thông báo gì",
        // imageUrl: imgUrl
      },
      aConfig: {
        channelId: "default"
      }
    };

    sendNotificationToSpecificDevice(params);
  } catch (error) {
    console.error(error);
  }

}
const app = admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

/**
* Sử dụng các hàm craft... bên dưới để tạo hàng loạt message (tối đa 500) sau đó gửi cùng một lượt để tăng performance.
*/
export async function sendNotificationsInBatch(messages: Message[]) {
  return getMessaging(app).sendEach(messages);
}

/** 
* Gửi thông báo tới một thiết bị dựa theo FCM token.
*/
export async function sendNotificationToSpecificDevice(params: NotificationPayloadToSpecificDevice) {
  return getMessaging(app).send(craftMessageToSpecificDevice(params));
}
/**
* Tạo message cho hàm sendNotificationToSpecificDevice
*/
export function craftMessageToSpecificDevice(params: NotificationPayloadToSpecificDevice): Message {
  return {
    token: params.fcmToken,
    ..._transformNotificationPayloadInterface(params)
  };
}

/** 
* Gửi thông báo tới thiết bị thỏa mãn điều kiện (ví dụ như kênh bắt đầu bằng `stresswatch`, hay vào 2 kênh `A` và `B`. Đọc thêm doc để biết thêm chi tiết.)
*/
export async function sendNotificationToCondition(params: NotificationPayloadToCondition) {
  return getMessaging(app).send(craftMessageToCondition(params));
}
/**
* Tạo message cho hàm sendNotificationToCondition
*/
export function craftMessageToCondition(params: NotificationPayloadToCondition): Message {
  return {
    condition: params.condition,
    ..._transformNotificationPayloadInterface(params)
  };
}

/** 
* Gửi thông báo tới một topic (là một kênh mà nhiều người bên fronend có thể cùng lắng nghe)
*/
export async function sendNotificationToTopic(params: NotificationPayloadToTopic) {
  return getMessaging(app).send(craftMessageToTopic(params));
}
/**
* Tạo message cho hàm sendNotificationToTopic
*/
export function craftMessageToTopic(params: NotificationPayloadToTopic): Message {
  return {
    topic: params.topic,
    ..._transformNotificationPayloadInterface(params)
  };
}

/** 
* Gửi thông báo tới nhiều thiết bị dựa theo FCM token.
*/
export async function sendNotificationToMultipleDevices(params: NotificationPayloadToMultipleDevices) {
  const message: MulticastMessage = {
    tokens: params.fcmTokens,
    ..._transformNotificationPayloadInterface(params)
  }
  return getMessaging(app).sendEachForMulticast(message);
}


/**
* Chuyển kiểu dữ liệu từ tham số thành BaseMessage.
*/
function _transformNotificationPayloadInterface(params: NotificationPayload): BaseMessage {
  return {
    notification: params.notification,
    data: params.data,
    android: {
      priority: "high",
      notification: {
        priority: "max",
        channelId: params.aConfig.channelId
      }
    },
    apns: {},
    webpush: {}
  };
}

/**
* Kiểu dữ liệu sử dụng khi gửi thông báo tới một thiết bị
*/
export interface NotificationPayloadToSpecificDevice extends NotificationPayload {
  /**
   * Là FCM Token của thiết bị
   */
  fcmToken: string;
}

/**
* Kiểu dữ liệu sử dụng khi gửi thông báo tới một topic
*/
export interface NotificationPayloadToCondition extends NotificationPayload {
  /**
   * Là biểu thức điều kiện
   */
  condition: string;
}

/**
* Kiểu dữ liệu sử dụng khi gửi thông báo tới một topic
*/
export interface NotificationPayloadToTopic extends NotificationPayload {
  /**
   * Là tên topic
   */
  topic: string;
}

/**
* Kiểu dữ liệu sử dụng khi gửi thông báo tới nhiều thiết bị
*/
export interface NotificationPayloadToMultipleDevices extends NotificationPayload {
  /**
   * Là mảng FCM Token của các thiết bị
   */
  fcmTokens: string[];
}

export interface NotificationPayload {
  /**
   * Là một object chứa các trường sẽ hiển thị lên màn hình
   */
  notification: {
    /**
    * Là tiêu đề của thông báo (chữ đậm bên trên)
    */
    title?: string, // có bài viết mới, ai thích của bạn
    /**
     * Là tiêu đề của thông báo (chữ nhỏ bên dưới)
     */
    body?: string, // anh A đã thêm bào viết mới
    /**
     * Là đường dẫn tới ảnh cho thông báo
     */
    imageUrl?: string,
  };
  /**
   * Là một object dưới dạng json, có key và value đều là string để truyền dữ liệu cho frontend
   */
  data?: {
    [key: string]: string; // postId - link đến post
  };
  /**
   * Là một object chứa cấu hình thông báo của android. Được tối giản so với api gốc.
   */
  aConfig: {
    /**
     * Là id cho kênh thông báo bên app android. Hiện tại chỉ có 1 kênh là "default"
     */
    channelId: string // = "default"
  };
}
export { admin };