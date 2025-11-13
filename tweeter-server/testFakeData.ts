import { FakeData } from "tweeter-shared";

const user = FakeData.instance.findUserByAlias("@allen");
console.log("Found user:", user);
