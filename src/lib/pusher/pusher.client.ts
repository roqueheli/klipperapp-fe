import Pusher from "pusher-js";

export let pusherClient: Pusher | undefined;

if (typeof window !== "undefined") {
    if (!window.__pusherClient) {
        window.__pusherClient = new Pusher(
            process.env.NEXT_PUBLIC_PUSHER_KEY || "",
            {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
                forceTLS: true,
            }
        );
    }
    pusherClient = window.__pusherClient;
}
