import { Component } from "@angular/core";
import mondaySdk from "monday-sdk-js";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  monday;
  user;
  settings;
  context;

  constructor() {
    this.monday = mondaySdk();
    this.settings = "";
    this.context = "";
    this.user = "";
  }

  ngOnInit() {
    this.fetchUserName();
    const self = this;
    this.monday.listen("settings", res => self.getSettings(res));
    this.monday.listen("context", res => self.getContext(res));
  }

  fetchUserName() {
    this.monday.api(`query { me { name } }`).then(res => {
      this.user = res.data.me;
    });
  }

  getSettings(res) {
    this.settings = JSON.stringify(res.data);
  }

  getContext(res) {
    this.context = JSON.stringify(res.data);
  }
}
