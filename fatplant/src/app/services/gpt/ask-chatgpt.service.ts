import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AskChatgptService {

  constructor(private http: HttpClient) { }

  askChatGPT(query: string) {
    return this.http.get("https://fatplantsmu.ddns.net:5000/chatgpt/?content=" + encodeURIComponent(query));
  }
}
