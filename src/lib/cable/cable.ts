import { createConsumer } from "@rails/actioncable";

const cable = createConsumer("ws://localhost:3000/cable"); // Cambia la URL si usas producción

export default cable;