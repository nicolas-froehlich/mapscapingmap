import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeatureCollection } from 'geojson';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: new HttpParams()
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  // /*
  // calls the default dbtest route from the backend
  // */ 
  // public sampleData(): Observable<FeatureCollection>  {
  //   const url = environment.api + '/test/dbtest';

  //   return this.http.get<FeatureCollection>(url, httpOptions);
  // }

  // // Method to get mining data //
  // public miningData(buffer : number): Observable<FeatureCollection>  {
  //   const url = environment.api + '/real/mining?buffer=' + buffer;
  //   return this.http.get<FeatureCollection>(url, httpOptions);
  // }

  // // // Method to get ethnic data
  // // public ethnicData(): Observable<ArrayBuffer> {
  // //   const requestUrl = environment.api + '/real/ethnic';
  // //   return this.http.get(requestUrl, { responseType: "arraybuffer" });
  // // }

  // // Method to get wind speed data
  // public ethnicData(ethnic_group: number): Observable<ArrayBuffer> {
  //   const requestUrl = environment.api + '/real/ethnic?ethnic_group=' + ethnic_group;
  //   return this.http.get(requestUrl, { responseType: "arraybuffer" });
  // }

  // Method to get conflict data
  // public conflictData(): Observable<FeatureCollection>  {
  //   const url = environment.api + '/real/conflict';

  //   return this.http.get<FeatureCollection>(url, httpOptions);
  // }

  // Method to get conflict data
  public intervieweeData(): Observable<FeatureCollection>  {
    const url = environment.api + '/real/interviewees';

    return this.http.get<FeatureCollection>(url, httpOptions);
  }


}
