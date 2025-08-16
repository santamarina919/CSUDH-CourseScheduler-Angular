import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Requirement} from '../scheduler-page/Requirement';
import {Prerequisite} from '../scheduler-page/Prerequisite';
import {Course} from '../scheduler-page/Course';


@Injectable({
  providedIn: 'root'
})
export class DegreeService {

  http = inject(HttpClient)


  fetchCourses(degreeId :string) {
    return this.http.get<Course[]>('api/degree/courses' , {params : new HttpParams().set("degreeId",degreeId), withCredentials : true})
  }

  fetchRequirements(degreeId :string) {
    return this.http.get<Requirement[]>('api/degree/requirements', {params : new HttpParams().set("degreeId",degreeId), withCredentials : true})
  }

  fetchPrerequisites(degreeId :string) {
    return this.http.get<Prerequisite[]>('api/degree/prerequisites', {params : new HttpParams().set("degreeId",degreeId), withCredentials : true})
  }

  fetchRootsOfDegree(degreeId :string) {
    return this.http.get<string[]>('api/degree/roots', {params : new HttpParams().set("degreeId",degreeId), withCredentials : true})
  }

}
