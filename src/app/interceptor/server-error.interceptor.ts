import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError, EMPTY, Observable, retry, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../../environments/environment.development";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Injectable({
    providedIn: 'root'
  }
)
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: MatSnackBar
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return  next.handle(req).pipe(retry(environment.RETRY))
      .pipe(tap(event => {
        if(event instanceof HttpResponse){
          if (event.body && event.body.error === true && event.body.errorMessage) {
            throw new Error(event.body.errorMessage);
          }/*else{
                    this.snackBar.open('SUCCESS', 'INFO', { duration: 2000});
                }*/
        }
      }))
      .pipe(catchError( (err)=> {
          if(err.status === 400){
              this.snackBar.open(err.message, 'ERROR 400', {duration: 5000});
          }else if(err.status === 404){
            this.snackBar.open('NO existe el recurso', 'ERROR 404', {duration: 5000});
          }else if(err.status === 403 || err.status === 401){
            this.snackBar.open(err.error.message, 'ERROR 403', {duration: 5000});
          }else if(err.status === 500){
            this.snackBar.open(err.error.message, 'ERROR 500', {duration: 5000});
          }else {
            this.snackBar.open(err.error.message, 'ERROR', {duration: 5000});
          }
          return EMPTY;
      }))

  }

}
