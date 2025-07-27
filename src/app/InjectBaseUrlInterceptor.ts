import {HttpEvent, HttpRequest} from '@angular/common/http';
import {HttpHandler, HttpHandlerFn} from '@angular/common/http';
import {Observable} from 'rxjs';


export function InjectBaseUrlInterceptor(req : HttpRequest<unknown>, next : HttpHandlerFn) :Observable<HttpEvent<unknown>> {
  const newReq = req.clone({url: 'http://localhost:8080/' + req.url})
  return next(newReq);
}
