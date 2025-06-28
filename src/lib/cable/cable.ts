import { createConsumer } from "@rails/actioncable";

const cable = createConsumer(`ws://localhost:3100/cable`);

export default cable;