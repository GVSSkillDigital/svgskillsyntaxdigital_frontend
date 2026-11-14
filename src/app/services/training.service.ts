import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id: number;
  code: string;
  title: string;
  category: string;
  duration: string;
  mode: string;
  fee: string;
  description: string;
}

export interface RegistrationRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  courseCode: string;
  educationLevel: string;
}

export interface MessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  registerStudent(data: RegistrationRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/auth/register`, data);
  }
}
