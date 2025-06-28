import { createConsumer } from "@rails/actioncable";

const cable = createConsumer(`ws://klipperapp-be-6fbfe24ddcb3.herokuapp.com/cable`);

export default cable;